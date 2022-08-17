import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { Client, Intents, TextChannel } from "discord.js";

import authOptions from "../auth/options";

import { prisma } from "../../../db/prisma";

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
// const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// client.login(token);

async function handler(request: NextApiRequest, response: NextApiResponse) {
  let risingEdge = false;
  const id = parseInt(request.query.id as string, 10);

  try {
    const session = await getServerSession(
      { req: request, res: response },
      authOptions
    );
    const { featured, public: isPublic } = request.query;
    if (!session?.userId) {
      return response.status(500).send("not logged in");
    }
    let data: any = {};

    if (featured !== undefined) {
      if (session?.role !== "admin") {
        return response.status(500).send("not admin");
      }
      data.featured = featured === "true";
    }

    if (isPublic !== undefined) {
      if (!session?.userId) {
        return response.status(500).send("not logged in");
      }
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
          public: true,
        },
      });

      if (session?.userId !== post.userId && session?.role !== "admin") {
        return response.status(500).send("can't change others posts");
      }

      const count = await prisma.post.count({
        where: {
          userId: session.userId,
          public: true,
          createdAt: {
            gte: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000 // 24 hours
            ),
          },
        },
      });

      if (count >= 3 && session?.role !== "admin") {
        return response.status(500).send("3 public posts per person per day");
      }

      data.public = isPublic === "true";
      if (!post.public && data.public) {
        risingEdge = true;
      }
    }

    await prisma.post.update({
      where: { id },
      data,
    });

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { stars: true },
        },
        stars: {
          where: {
            userId: session.userId,
          },
        },
        user: { select: { id: true, name: true, image: true } },

        parent: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            views: true,
            metadata: true,
            codeHash: true,
            _count: {
              select: { stars: true },
            },
            children: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            views: true,
            metadata: true,
            _count: {
              select: { stars: true },
            },
            createdAt: true,
          },
        },
      },
    });
    response.status(200).json(post);
  } catch (err) {
    throw err;
  } finally {
    // if (risingEdge) {
    //   const post = await prisma.post.findUnique({
    //     where: {
    //       id,
    //     },
    //     select: {
    //       metadata: true,
    //     },
    //   });
    //   let { elements, disabled } = JSON.parse(post.metadata);
    //   let enabledElements = elements.filter((_, i) => !disabled[i]);
    //   let title = enabledElements.join(" ");
    //   const channel = (await client.channels.fetch(
    //     "978159725663367188"
    //   )) as TextChannel;
    //   channel.send(`https://studio.sandspiel.club/post/${id}\n ${title}`);
    // }
  }
}
export default withSentry(handler);
