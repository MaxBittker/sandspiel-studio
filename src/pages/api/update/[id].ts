import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import authOptions from "../auth/options";

import { prisma } from "../../../db/prisma";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = parseInt(request.query.id as string, 10);
    const session = await getServerSession(
      { req: request, res: response },
      authOptions
    );
    const { featured } = request.query;

    console.log(session);
    if (!session?.userId) {
      return response.status(500).send("not logged in");
    }

    if (featured && session?.role !== "admin") {
      return response.status(500).send("not admin");
    }

    await prisma.post.update({
      where: { id },
      data: { featured: !!featured },
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
  }
}
export default withSentry(handler);
