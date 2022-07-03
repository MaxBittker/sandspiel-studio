import { NextApiRequest, NextApiResponse } from "next";

import { Storage } from "@google-cloud/storage";
import { Client, Intents, TextChannel } from "discord.js";
import { getServerSession } from "next-auth";
import { withSentry } from "@sentry/nextjs";

import md5 from "md5";
import { prisma } from "../../db/prisma";
import authOptions from "./auth/options";

const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login(token);

async function getUploadUrl(bucket, id, contentType, suffix) {
  const filename = `creations/${id}${suffix}`;

  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 30 * 60 * 1000, // 30 minutes
    contentType,
  };

  const [url] = await bucket.file(filename).getSignedUrl(options);
  return url;
}

async function handler(request: NextApiRequest, response: NextApiResponse) {
  let postId = undefined;

  const session = await getServerSession(
    { req: request, res: response },
    authOptions
  );
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
        user: { select: { id: true, name: true, image: true } },
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

    let [dataUploadUrl, thumbUploadUrl, gifUploadUrl] = await Promise.all([
      getUploadUrl(bucket, newPost.id, "image/png", ".data.png"),
      getUploadUrl(bucket, newPost.id, "image/png", ".png"),
      getUploadUrl(bucket, newPost.id, "image/gif", ".gif"),
    ]);

    response
      .status(200)
      .json({ ...newPost, dataUploadUrl, thumbUploadUrl, gifUploadUrl });
  } catch (err) {
    throw err;
  } finally {
    // let title = request.body.title.slice(0, 500);
    let { elements, disabled } = JSON.parse(request.body.metadata);
    let enabledElements = elements.filter((_, i) => !disabled[i]);
    let title = enabledElements.join(" ");
    const channel = (await client.channels.fetch(
      request.body.public ? "978159725663367188" : "983217410205167631"
    )) as TextChannel;

    channel.send(`https://studio.sandspiel.club/post/${postId}\n ${title}`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1.5mb", // Set desired value here
    },
  },
};
export default withSentry(handler);

// await Promise.all([
//   uploadPNG(bucket, newPost.id, request.body.data, ".data.png"),
//   uploadPNG(bucket, newPost.id, request.body.thumbnail, ".png"),
//   uploadPNG(bucket, newPost.id, request.body.gif, ".gif"),
// ]);

// function uploadPNG(bucket, id, pngData, suffix) {
//   const mimeType = pngData.match(
//     /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
//   )[1];
//   const filename = `creations/${id}${suffix}`;
//   const base64EncodedImageString = pngData.replace(
//     /^data:image\/\w+;base64,/,
//     ""
//   );
//   const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

//   const file = bucket.file(filename);

//   return file.save(imageBuffer, {
//     metadata: { contentType: mimeType },
//     validation: "md5",
//   });
// }
