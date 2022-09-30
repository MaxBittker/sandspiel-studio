import { NextApiRequest, NextApiResponse } from "next";

import { PostWhereInput } from "@prisma/client/generator-build";
import { getServerSession } from "next-auth";
import { withSentry } from "@sentry/nextjs";
import authOptions from "./auth/options";
import { prisma } from "../../db/prisma";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const id = request.query.id as string;

  const session = await getServerSession(
    { req: request, res: response },
    authOptions
  );
  // const userId = session.userId as string;

  try {
    // todo cursor based pagination
    let user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, image: true, Star: true },
    });

    if (!user) {
      response.status(404);
    } else {
      response.status(200).json(user);
    }
  } catch (err) {
    throw err;
  }
}

export default withSentry(handler);
