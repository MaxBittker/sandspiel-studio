import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const allPosts = await prisma.post.findMany();
  console.log(allPosts);

  const newPost = await prisma.post.create({
    data: {
      title: "test post",
      content: request.body,
      public: false,
    },
  });
  console.log(newPost);

  const { xmls } = request.body as {
    [key: string]: string;
  };
  console.log(xmls);
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });

  await prisma.$disconnect();
}
