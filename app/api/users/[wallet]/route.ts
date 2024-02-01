// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
    include: {
      Referrer: {
        include: {
          referrer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return Response.json({ success: false, message: "User does not exist" });
  }

  return Response.json(user);
}
