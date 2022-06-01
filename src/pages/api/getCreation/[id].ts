import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const id = parseInt(request.query.id as string, 10);

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            createdAt: true,
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

    response.status(200).json(post);
  } catch (err) {
    throw err;
  } finally {
    const id = parseInt(request.query.id as string, 10);
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    await prisma.$disconnect();
  }
}
