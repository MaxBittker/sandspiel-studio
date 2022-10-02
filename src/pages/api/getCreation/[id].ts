import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../db/prisma";

import { getServerSession } from "next-auth";
import authOptions from "../auth/options";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const id = parseInt(request.query.id as string, 10);
    const session = await getServerSession(
      { req: request, res: response },
      authOptions
    );

    const userId = session?.userId;
    let postCount = 0;
    if (userId) {
      postCount = await prisma.post.count({
        where: {
          userId: userId,
          public: true,
          createdAt: {
            gte: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000 // 24 hours
            ),
          },
        },
      });
    }
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { stars: true },
        },
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
        user: { select: { id: true, name: true, image: true } },
        stars: {
          where: {
            userId,
          },
        },
      },
    });
    if (!post) {
      response.status(404);
    } else {
      post["postCount"] = postCount;
      response.status(200).json(post);
    }
  } catch (err) {
    throw err;
  } finally {
    const id = parseInt(request.query.id as string, 10);
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}
export default withSentry(handler);
