import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: "test post",
        code: request.body.code,
        public: false,
      },
    });

    response.status(200).json({
      id: newPost.id,
    });
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
