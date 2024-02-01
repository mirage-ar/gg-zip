// GET USER ENDPOINT
import prisma from "@/utils/prisma";
import { Invite } from "@/types";

function generateRandomCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function createCode(userId: string): Promise<void> {
  const newCode = generateRandomCode(5);

  const codeExists = await prisma.code.findUnique({
    where: {
      value: newCode,
    },
  });

  if (codeExists) {
    return createCode(userId); // Recursively call the function if code exists
  } else {
    const code = await prisma.code.create({
      data: {
        value: newCode,
        reusable: false,
        userId: userId,
      },
    });

    console.log(code.value);
  }
}

export async function GET(request: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;

  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
  });

  if (!user) {
    console.error("ERROR: Could not find user");
    return Response.json({ success: false, message: "User does not exist" });
  }

  const codes = await prisma.code.findMany({
    where: {
      userId: user.id,
      reusable: false,
    },
  });

  const referrals = await prisma.referral.findMany({
    where: {
      referrerId: user.id,
    },
    include: {
      user: true,
    },
  });

  const formattedCodes: Invite[] = codes.map((code) => {
    const referral = referrals.find((referral) => referral.code === code.value);
    return {
      id: code.id,
      code: code.value,
      claimed: referral ? true : false,
      claimedUsername: referral ? referral.user?.name : null,
      claimedImage: referral ? referral.user?.image : null,
      claimedPoints: referral ? referral.points : null,
    };
  });

  return Response.json(formattedCodes);
}

// export async function POST(request: Request, { params }: { params: { wallet: string } }) {
//   const wallet = params.wallet;

// const user = await prisma.user.findUnique({
//     where: {
//       wallet: wallet,
//     },
//   });

//   if (!user) {
//     return Response.json({ success: false, message: "User not found!" });
//   }

//   for (let i = 0; i < 10; i++) {
//     await createCode(user.id);
//   }

//   return Response.json({ success: true, message: "Codes created!" });
// }
