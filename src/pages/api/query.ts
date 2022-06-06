import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { PostWhereInput } from "@prisma/client/generator-build";
import { getSession } from "next-auth/react";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const prisma = new PrismaClient();
  const { order, codeHash, userId, days, starredBy } = request.query;

  const session = await getSession({ req: request });
  // const userId = session.userId as string;

  let orderBy: PostWhereInput = { createdAt: "desc" };
  if (order === "top") {
    orderBy = { views: "desc" };
  }
  let where: PostWhereInput = {
    userId: {
      not: {
        equals: null,
      },
    },
  };
  if (codeHash) {
    where = {
      codeHash,
    };
  }
  if (userId) {
    where = {
      userId,
    };
  }
  if (starredBy) {
    where = {
      stars: {
        some: {
          userId: starredBy,
        },
      },
    };
  }

  if (days) {
    where.createdAt = {
      gte: new Date(
        Date.now() - parseInt(days as string, 10) * 24 * 60 * 60 * 1000
      ),
    };
  }
  try {
    // let userId = request.body.userId;

    let posts = await prisma.post.findMany({
      take: 100,
      where,
      orderBy,
      select: {
        id: true,
        createdAt: true,
        title: true,
        views: true,
        metadata: true,
        codeHash: true,
        _count: {
          select: { stars: true },
        },
        parent: {
          select: {
            id: true,
          },
        },
        children: {
          select: {
            id: true,
          },
        },
        user: { select: { id: true, name: true, image: true } },
      },
    });

    response.status(200).json(posts);
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
