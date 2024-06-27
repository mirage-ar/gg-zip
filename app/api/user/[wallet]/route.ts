// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  console.log("QUERY USER: ", wallet);

  try {
    const user = await prisma.user.findUnique({
      where: {
        wallet: wallet,
      },
    });

    if (!user) {
      return Response.json({ success: false, message: "User does not exist" });
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ success: false, message: "Error fetching user" });
  }
}

export async function POST(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const data = await request.json();
  const { username, image, twitterId } = data;

  try {
    const userPoints = await prisma.points.findUnique({
      where: {
        wallet: wallet,
      },
    });

    // TODO: clean this up after next game
    const userHasTwitterId = await prisma.user.findUnique({
      where: {
        twitterId: twitterId,
      },
    });

    if (userHasTwitterId) {
      const userHasWallet = await prisma.user.findUnique({
        where: {
          wallet: wallet,
        },
      });

      if (userHasWallet) {
        await prisma.user.delete({
          where: {
            wallet: wallet,
          },
        });
      }

      await prisma.user.update({
        where: {
          twitterId: twitterId,
        },
        data: {
          wallet: wallet,
        },
      });
    }

    const user = await prisma.user.upsert({
      where: {
        wallet: wallet,
      },
      update: {
        username: username,
        image: image,
        points: userPoints?.points,
        twitterId: twitterId,
      },
      create: {
        username: username,
        twitterId: twitterId,
        image: image,
        wallet: wallet,
        points: userPoints?.points || 0,
      },
    });

    if (!user) {
      return Response.json({ success: false, message: "Could not create user" });
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ success: false, message: "Error updating user" });
  }
}
