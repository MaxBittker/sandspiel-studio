import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
export const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";
import { prisma } from "../../db/prisma";
import { withSentry } from "@sentry/nextjs";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request });
  const userId: string = session?.userId as string;

  try {
    let postId: string = request.body.postId.toString();

    const newUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: `${imageURLBase}${postId}.png`,
      },
    });

    response.status(200).json(newUser);
  } catch (err) {
    throw err;
  }
}
export default withSentry(handler);
