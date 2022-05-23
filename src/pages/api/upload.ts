import { NextApiRequest, NextApiResponse } from "next";

import { Storage } from "@google-cloud/storage";
import { PrismaClient } from "@prisma/client";

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

    const newPost = await prisma.post.create({
      data: {
        title: "untitled",
        code: request.body.code,
        public: false,
        parentId: parentId,
      },
    });

    const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

    await Promise.all([
      uploadPNG(bucket, newPost.id, request.body.data, ".data.png"),
      uploadPNG(bucket, newPost.id, request.body.thumbnail, ".png"),
    ]);

    response.status(200).json({
      id: newPost.id,
    });
  } catch (err) {
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}
