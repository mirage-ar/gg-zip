import prisma from "@/utils/prisma";

import { User } from "@prisma/client";

export async function GET(request: Request) {
  console.log("QUERY SPONSORS")
  try {
    // Fetch sponsors 
    const users = await prisma.user.findMany({
      where: {
        points: {
          gt: 0,
        },
        updatedAt: {
          // TODO: for game, update this to 1 hour
          // gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 1), // last hour
          gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1), // last 24 hours
        },
      },
    });

    // sort users by points
    users.sort((a: User, b: User) => b.points - a.points);

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error("Error get sponsors:", error);
    return Response.json({ success: false });
  }
}
