import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const id = parseInt(request.query.id as string, 10);
    const session = await getSession({ req: request });

    console.log(session);
    if (!session?.userId) {
      return response.status(500).send("not logged in");
    }
    const star = await prisma.star.create({
      data: {
        postId: id,
        userId: session.userId as string,
      },
    });

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
            children: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });
    post["stars"] = post._count.stars;
    response.status(200).json(post);
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}