import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { id } = request.query;
    console.log(id);

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id as string, 10),
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
    await prisma.$disconnect();
  }
}
