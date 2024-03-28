// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  const user = await prisma.points.findUnique({
    where: {
      wallet: wallet,
    },
    cacheStrategy: {
      ttl: 60,
    },
  });

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  return Response.json(user);
}
