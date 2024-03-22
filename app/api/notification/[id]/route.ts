// GET USER ENDPOINT
import prisma from "@/utils/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const boxId = params.id;

  const latestBox = await prisma.box.findFirst({
    where: {
      collectorId: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      collector: true,
    },
  });

  if (!latestBox) {
    return Response.json({ success: false, message: "Box does not exist" });
  }

  if (boxId === latestBox?.id) {
    return Response.json({ success: false, message: "No new boxes" });
  }

  return Response.json(latestBox);
}
