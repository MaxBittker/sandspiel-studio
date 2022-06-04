import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { PostWhereInput } from "@prisma/client/generator-build";
import { getSession } from "next-auth/react";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const prisma = new PrismaClient();
  const { order } = request.query;

  const session = await getSession({ req: request });
  // const userId = session.userId as string;

  let orderBy: PostWhereInput = { createdAt: "desc" };
  if (order === "top") {
    orderBy = { views: "desc" };
  }
  try {
    // let userId = request.body.userId;

    let posts = await prisma.post.findMany({
      take: 100,
      where: {
        userId: {
          not: {
            equals: null,
          },
        },
      },
      orderBy,
      select: {
        id: true,
        createdAt: true,
        title: true,
        views: true,
        metadata: true,
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
