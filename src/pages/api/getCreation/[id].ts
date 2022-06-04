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
