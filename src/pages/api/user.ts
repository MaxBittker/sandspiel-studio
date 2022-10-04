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
    const userPromise = prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bannedAt: true,
        _count: {
          select: { Star: true },
        },
      },
    });

    const starsReceivedPromise = prisma.star.count({
      where: {
        post: { userId: id },
      },
    });

    const trophiesReceivedPromise = prisma.post.count({
      where: {
        userId: id,
        NOT: {
          featuredAt: { equals: null },
        },
      },
    });

    const [user, starsReceived, trophiesReceived] = await Promise.all([
      userPromise,
      starsReceivedPromise,
      trophiesReceivedPromise,
    ]);

    user["starsReceived"] = starsReceived;
    user["trophiesReceived"] = trophiesReceived;

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
