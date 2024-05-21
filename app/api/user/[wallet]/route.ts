// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
  });

  if (!user) {
    const pointsUser = await prisma.points.findUnique({
      where: {
        wallet: wallet,
      },
    });

    if (!pointsUser) {
      return Response.json({ success: false, message: "User does not exist" });
    }

    return Response.json({ success: true, data: pointsUser });
  }

  return Response.json({ success: true, data: user });
}

export async function POST(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const data = await request.json();
  const { username, image } = data;

  const userPoints = await prisma.points.findUnique({
    where: {
      wallet: wallet,
    },
  });

  const user = await prisma.user.upsert({
    where: {
      wallet: wallet,
    },
    update: {
      points: userPoints?.points,
    },
    create: {
      // TODO: 1) UPDATE TO USERNAME + IMAGE WHEN POPOVER IS FINISHED
      username: userPoints?.username || username,
      twitterId: userPoints?.twitterId,
      image: userPoints?.image || image,
      wallet: wallet,
      points: userPoints?.points || 0,
    },
  });

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  return Response.json({ success: true, data: user });
}
