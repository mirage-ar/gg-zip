import prisma from "@/utils/prisma";

// GET USER ENDPOINT
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
      return new Response(JSON.stringify({ success: false, message: "User does not exist" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ success: false, message: "Error fetching user" }), { status: 500 });
  }
}

// POST (UPDATE) USER ENDPOINT
export async function POST(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const data = await request.json();
  const { username, image, twitterId } = data;

  console.log("UPDATE USER: ", wallet);

  try {
    // Find the user by wallet
    const existingUserByWallet = await prisma.user.findUnique({
      where: {
        wallet: wallet,
      },
    });

    // Find the user by twitterId, if it's not null
    const existingUserByTwitterId = twitterId
      ? await prisma.user.findUnique({
          where: {
            twitterId: twitterId,
          },
        })
      : null;

    if (existingUserByTwitterId && existingUserByWallet) {
      // Both users exist, update the user with twitterId and the new wallet
      const user = await prisma.user.update({
        where: {
          twitterId: twitterId,
        },
        data: {
          username: username,
          image: image,
          wallet: wallet,
        },
      });

      return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
    } else if (existingUserByTwitterId && !existingUserByWallet) {
      // Only the user with twitterId exists, update it with the new wallet
      const user = await prisma.user.update({
        where: {
          twitterId: twitterId,
        },
        data: {
          username: username,
          image: image,
          wallet: wallet,
        },
      });

      return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
    } else if (!existingUserByTwitterId && existingUserByWallet) {
      // Only the user with wallet exists, update it with the new twitterId (if provided)
      const user = await prisma.user.update({
        where: {
          wallet: wallet,
        },
        data: {
          username: username,
          image: image,
          twitterId: twitterId || existingUserByWallet.twitterId, // Keep the existing twitterId if not provided
        },
      });

      return new Response(JSON.stringify({ success: true, data: user }), { status: 200 });
    } else {
      // Neither user exists, create a new user
      const user = await prisma.user.create({
        data: {
          username: username,
          twitterId: twitterId,
          image: image,
          wallet: wallet,
          points: 0,
        },
      });

      return new Response(JSON.stringify({ success: true, data: user }), { status: 201 });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ success: false, message: "Error updating user" }), { status: 500 });
  }
}
