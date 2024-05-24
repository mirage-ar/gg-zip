import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  // Fetch the specific user
  const user = await prisma.user.findUnique({
    where: {
      wallet,
    },
  });

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  const rankResult: any = await prisma.$queryRaw`
  SELECT rank FROM (
    SELECT 
      id, 
      RANK() OVER (ORDER BY points DESC) as rank
    FROM 
      "User"
  ) as ranks
  WHERE 
    id = ${user.id}
`;

  // convert bigint to int
  const rank = parseInt(rankResult[0].rank);

  return Response.json({ rank });
}
