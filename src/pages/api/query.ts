import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const prisma = new PrismaClient();

  const session = await getSession({ req: request });
  // const userId = session.userId as string;

  try {
    // let userId = request.body.userId;

    const posts = await prisma.post.findMany({
      take: 100,
      where: {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        title: true,
        views: true,
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
        user: true,
      },
    });
    response.status(200).json(posts);
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
