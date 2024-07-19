import prisma from "@/utils/prisma";

import { User } from "@prisma/client";

export async function GET(request: Request) {
  console.log("QUERY LEADERBOARD USERS");
  try {
    // Fetch sponsors
    const users = await prisma.user.findMany({
      where: {
        points: {
          gt: 0,
        },
        twitterId: null,
      },
      take: 150,
      orderBy: {
        points: "desc",
      },
    });

    console.log(users);

    // sort users by points
    // users.sort((a: User, b: User) => b.points - a.points);

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error("Error get sponsors:", error);
    return Response.json({ success: false });
  }
}
