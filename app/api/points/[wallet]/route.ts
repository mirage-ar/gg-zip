// GET USER ENDPOINT
import prisma from "@/utils/prisma";

import * as anchor from "@project-serum/anchor";

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

export async function POST(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  // const user = await prisma.points.findUnique({
  //   where: {
  //     wallet: wallet,
  //   },
  // });

  // if (!user) {
  //   return Response.json({ success: false, message: "User does not exist" });
  // }

  return Response.json({ points: 1000 });
}