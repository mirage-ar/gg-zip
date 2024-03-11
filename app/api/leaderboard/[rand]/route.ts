// LIVE LEADERBOARD ROUTE
import { LiveLeaderboardItem } from "@/types";
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  const leaderboard = await prisma.user.findMany({
    orderBy: {
      points: "desc",
    },
  });

  return Response.json(leaderboard);
}
