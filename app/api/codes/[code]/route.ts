// GET USER ENDPOINT
import prisma from "@/utils/prisma";


export async function GET(request: Request, { params }: { params: { code: string } }) {
  const code = params.code;

  // is reusable

  const existingCode = await prisma.code.findUnique({
    where: {
      value: code,
    },
  });

  if (existingCode?.reusable) {
    return Response.json({ exists: true, used: false });
  }

  const used = await prisma.referral.findMany({
    where: {
      code: code,
    },
  });

  return Response.json({ exists: existingCode?.id ? true : false, used: used.length > 0 });
}