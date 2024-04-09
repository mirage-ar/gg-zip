// LIVE LEADERBOARD ROUTE
import { LiveLeaderboardItem } from "@/types";
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  try {
    const leaderboard = await prisma.user.findMany({
      orderBy: {
        points: "desc",
      },
      take: 500,
      cacheStrategy: {
        ttl: 5,
      },
    });

    return Response.json(leaderboard);
  } catch (error) {
    throw new Error(`LEADERBOARD ERROR: ${error}`);
  }
}
