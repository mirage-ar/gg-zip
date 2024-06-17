const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

type Hunter = {
  id: string;
  username: string;
  boxes: number;
  points: number;
  wallet: string;
};

async function getHunters(): Promise<Hunter[]> {
  try {
    const response = await axios.get("https://ybobrsrwn3.execute-api.us-east-1.amazonaws.com/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching hunters:", error);
    throw error;
  }
}

async function main() {
  const hunters = await getHunters();

  // TODO: update user rank for each player

  for (const hunter of hunters) {
    try {
      // apply user points
      const user = await prisma.user.update({
        where: { twitterId: hunter.id },
        data: {
          points: {
            increment: hunter.points,
          },
        },
      });

      // get user rank based on point totals
      const rankResult: any = await prisma.$queryRaw`
        SELECT rank FROM (
          SELECT 
            id, 
            RANK() OVER (ORDER BY points DESC) as rank
          FROM 
            "User"
        ) as ranks
        WHERE 
          id = ${user.id}
      `;

      // apply user rank update
      await prisma.user.update({
        where: { twitterId: hunter.id },
        data: {
          points: {
            increment: hunter.points,
          },
          rank: parseInt(rankResult[0].rank),
        },
      });
    } catch (error) {
      console.error("Error updating hunter:", error);
    }
  }
}

main();
