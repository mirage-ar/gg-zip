// LIVE LEADERBOARD ROUTE
import { LiveLeaderboardItem } from "@/types";
import prisma from "@/utils/prisma";

export async function GET(request: Request) {
  const users = await prisma.user.findMany({
    orderBy: {
      points: "desc",
    },
  });

  let leaderboard: LiveLeaderboardItem[] = [];

  // TODO: remove if too many users
  for (const user of users) {
    const boxesCount = await prisma.box.count({
      where: {
        collectorId: user.id,
      },
    });

    leaderboard.push({
      id: user.id,
      wallet: user.wallet,
      username: user.username,
      image: user.image || "",
      points: user.points,
      box: boxesCount,
    });
  }

  return Response.json(leaderboard);
}
