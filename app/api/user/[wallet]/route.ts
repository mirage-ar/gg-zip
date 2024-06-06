// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
    // cacheStrategy: { // TODO: cache doesn't work with user popover
    //   ttl: 60,
    // }
  });

  // if (!user) {
  //   const pointsUser = await prisma.points.findUnique({
  //     where: {
  //       wallet: wallet,
  //     },
  //   });

  //   if (!pointsUser) {
  //     return Response.json({ success: false, message: "User does not exist" });
  //   }

  //   return Response.json({ success: true, data: pointsUser });
  // }

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  return Response.json({ success: true, data: user });
}

export async function POST(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const data = await request.json();
  const { username, image, twitterId } = data;

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
      username: username,
      image: image,
      points: userPoints?.points,
    },
    create: {
      username: username,
      twitterId: twitterId || userPoints?.twitterId,
      image: image,
      wallet: wallet,
      points: userPoints?.points || 0,
    },
  });

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  return Response.json({ success: true, data: user });
}
