// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { time: string } }) {
  // get player count
  const players = await prisma.user.count({
    cacheStrategy: {
      ttl: 5,
    },
  });

  return Response.json(players);
}
