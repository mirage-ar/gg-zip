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
  // const prismaUsers = await prisma.user.findMany();
  // for (const user of prismaUsers) {
  //   const points = user.inGamePoints + user.points;

  //   try {
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         points: points,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error updating game points for user:", error);
  //   }
  // }

  const hunters = await getHunters();

  // First, update points for each hunter
  // for (const hunter of hunters) {
  //   try {
  //     await prisma.user.update({
  //       where: { twitterId: hunter.id },
  //       data: {
  //         points: {
  //           increment: hunter.points,
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error updating points for hunter:", error);
  //   }
  // }

  const allUsers = await prisma.user.findMany({
    where: {
      gamePoints: {
        gt: 0,
      },
    },
  });

  for (const user of allUsers) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          gamePoints: 0,
        },
      });
    } catch (error) {
      console.error("Error updating game points for user:", error);
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
