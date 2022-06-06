import { NextApiRequest, NextApiResponse } from "next";

import { Storage } from "@google-cloud/storage";
import { PrismaClient } from "@prisma/client";
import { Client, Intents, TextChannel } from "discord.js";
import { getSession } from "next-auth/react";

import md5 from "md5";

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(token);

function uploadPNG(bucket, id, pngData, suffix) {
  const mimeType = pngData.match(
    /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
  )[1];
  const filename = `creations/${id}${suffix}`;
  const base64EncodedImageString = pngData.replace(
    /^data:image\/\w+;base64,/,
    ""
  );
  const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

  const file = bucket.file(filename);

  return file.save(imageBuffer, {
    metadata: { contentType: mimeType },
    validation: "md5",
  });
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const prisma = new PrismaClient();
  let postId = undefined;

  const session = await getSession({ req: request });
  const userId: string = session?.userId as string;

  try {
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY,
      },
    });

    let parentId = request.body.parentId
      ? parseInt(request.body.parentId)
      : undefined;

    let title = request.body.title.slice(0, 500);

    const newPost = await prisma.post.create({
      data: {
        userId: userId ?? undefined,
        title: title,
        code: request.body.code,
        codeHash: md5(request.body.code),
        metadata: request.body.metadata,
        public: request.body.public,
        parentId: parentId,
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
      },
    });
    postId = newPost.id;

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

    await Promise.all([
      uploadPNG(bucket, newPost.id, request.body.data, ".data.png"),
      uploadPNG(bucket, newPost.id, request.body.thumbnail, ".png"),
    ]);

    response.status(200).json(newPost);
  } catch (err) {
    throw err;
  } finally {
    let title = request.body.title.slice(0, 500);

    const channel = (await client.channels.fetch(
      request.body.public ? "978159725663367188" : "983217410205167631"
    )) as TextChannel;

    channel.send(`https://studio.sandspiel.club/post/${postId}\n ${title}`);

    await prisma.$disconnect();
  }
}
