import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Connection, PublicKey } from "@solana/web3.js";

import prisma from "@/utils/prisma";

import { RPC, PROGRAM_ID } from "@/utils/constants";

import IDL from "@/solana/idl.json";

function bnToNumber(bn: any): number {
  if (!bn) {
    console.warn('Attempted to convert an undefined or null value to number');
    return 0;
  }
  
  // Check if bn is an instance of anchor.BN and has a toNumber method
  if (bn instanceof anchor.BN && typeof bn.toNumber === 'function') {
    try {
      return bn.toNumber();
    } catch (error) {
      console.error('Failed to convert BN to number:', error);
      return 0;
    }
  } else {
    console.warn('Provided value is not an anchor.BN object');
    return 0;
  }
}


async function getTotalShares(program: anchor.Program, wallet: string): Promise<number> {
  try {
    const walletPublicKey = new PublicKey(wallet);
    const walletBuffer = walletPublicKey.toBuffer();

    const [mintPda, mintBump] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

    const playerAccount = await program.account.mintAccount.fetch(mintPda);
    const playerCardCount = bnToNumber(playerAccount.amount);

    return playerCardCount || 0;
  } catch (error) {
    console.error("Error get total shares:", error);
    return 0;
  }
}

async function getSponsorAccounts(program: anchor.Program, wallet: string) {
  try {
    const subjectFilter = [
      {
        memcmp: {
          offset: 40, // 8 bytes discriminator + 32 bytes owner
          bytes: wallet,
        },
      },
    ];

    const accounts = await program.account.tokenAccount.all(subjectFilter);

    console.log("Wallet:", wallet);
    console.log("Accounts:", accounts);

    return accounts;
  } catch (error) {
    console.error("Error get sponsor accounts:", error);
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const { subject, points } = data;

  const connection = new Connection(RPC);
  const programId = new PublicKey(PROGRAM_ID);

  const MockWallet = {
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
    publicKey: new PublicKey(subject),
  };

  const provider = new anchor.AnchorProvider(connection, MockWallet, anchor.AnchorProvider.defaultOptions());
  // @ts-ignore
  const program = new anchor.Program(IDL, programId, provider);

  const allSponsorAccounts = await getSponsorAccounts(program, subject);

  const filteredSponsorAccounts = allSponsorAccounts?.filter((account) => {
    return bnToNumber(account.account.amount) > 0;
  });

  const totalShares = await getTotalShares(program, subject);

  const promises = (filteredSponsorAccounts || []).map(async (account) => {
    const wallet: string = (account.account.owner as anchor.web3.PublicKey).toBase58();
    const sponsorAccount = account.account;

    if (!sponsorAccount) {
      return Response.json({ success: false, message: "Sponsor account not found" });
    }

    if (!sponsorAccount.amount) {
      console.log("Sponsor not holding any shares - shouldn't be possible");
      return Response.json({ success: false, message: "Sponsor has 0 holding" });
    }

    try {
      const sponsorShares = bnToNumber(sponsorAccount.amount);
      console.log("Sponsor shares: ", sponsorShares);
      const sponsorPercentage = sponsorShares / totalShares;
      console.log("Sponsor percentage: ", sponsorPercentage);
      const pointsToGive = points * 3 * sponsorPercentage;
      console.log("Points to give: ", pointsToGive);

      try {
        await prisma.user.update({
          where: {
            wallet: wallet,
          },
          data: {
            gamePoints: {
              increment: pointsToGive,
            },
          },
        });
      } catch (error) {
        console.error("No user record to update");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  });

  await Promise.all(promises);

  return Response.json({ success: true });
}
