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

type RankResult = {
  id: string;
  rank: number;
};

async function getHunters(): Promise<Hunter[]> {
  try {
    const response = await axios.get("https://api.koji.im/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching hunters:", error);
    throw error;
  }
}

async function end() {
  const hunters = await getHunters();

  // First, update points for each hunter
  for (const hunter of hunters) {
    try {
      await prisma.user.update({
        where: { twitterId: hunter.id },
        data: {
          points: {
            increment: hunter.points,
          },
        },
      });
    } catch (error) {
      console.error("Error updating points for hunter:", error);
    }
  }

  // Get all users' ranks based on updated points
  const rankResults: RankResult[] = await prisma.$queryRaw`
    SELECT id, RANK() OVER (ORDER BY points DESC) as rank
    FROM "User"
  `;

  const rankMap: { [key: string]: number } = {};
  rankResults.forEach((result: RankResult) => {
    rankMap[result.id] = result.rank;
  });

  // Update rank for each hunter
  // TODO: update this to be for ALL USERS, not just hunters
  for (const hunter of hunters) {
    try {
      const user = await prisma.user.findUnique({
        where: { twitterId: hunter.id },
      });

      if (user) {
        await prisma.user.update({
          where: { twitterId: hunter.id },
          data: {
            rank: rankMap[user.id],
          },
        });
      }
    } catch (error) {
      console.error("Error updating rank for hunter:", error);
    }
  }
}

end()
  .catch((error) => {
    console.error("Error in main function:", error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
