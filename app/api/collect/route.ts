import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Connection, PublicKey } from "@solana/web3.js";
import { bnToNumber } from "@/solana";

import prisma from "@/utils/prisma";

import { RPC, PROGRAM_ID } from "@/utils/constants";

import IDL from "@/solana/idl.json";

async function getTotalShares(program: anchor.Program, wallet: string): Promise<number> {
  try {
    const walletPublicKey = new PublicKey(wallet);
    const walletBuffer = walletPublicKey.toBuffer();

    const [mintPda, mintBump] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

    const playerAccount = await program.account.mintAccount.fetch(mintPda);
    const playerCardCount = bnToNumber(playerAccount.amount as anchor.BN);

    return playerCardCount || 0;
  } catch (error) {
    console.error("Error get total shares:", error);
    return 0;
  }
}

async function getSponsorAccounts(program: anchor.Program, wallet: string) {
  try {
    const walletPublicKey = new PublicKey(wallet);

    const subjectFilter = [
      {
        memcmp: {
          offset: 40, // 8 bytes discriminator + 32 bytes owner
          bytes: walletPublicKey.toBase58(),
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

async function getTokenAccount(program: anchor.Program, wallet: string, subject: string) {
  try {
    const subjectPublicKey = new PublicKey(subject);
    const subjectBuffer = subjectPublicKey.toBuffer();

    const sponsorPublicKey = new PublicKey(wallet);
    const sponsorBuffer = sponsorPublicKey.toBuffer();

    const [tokenPda] = await findProgramAddressSync(
      [Buffer.from("TOKEN"), sponsorBuffer, subjectBuffer],
      program.programId
    );

    const tokenAccount = await program.account.tokenAccount.fetch(tokenPda);

    return tokenAccount;
  } catch (error) {
    console.error("Error get token account:", error);
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

  const promises = (allSponsorAccounts || []).map(async (account) => {
    const wallet = account.publicKey.toBase58();

    const sponsorAccount = await getTokenAccount(program, wallet, subject);

    if (!sponsorAccount) {
      return Response.json({ success: false, message: "Sponsor account not found" });
    }

    console.log("Points:", points);
    const sponsorShares = bnToNumber(sponsorAccount.amount as anchor.BN);
    console.log("Sponsor shares:", sponsorShares);
    const totalShares = await getTotalShares(program, subject);
    console.log("Total shares:", totalShares);
    const sponsorPercentage = sponsorShares / totalShares;
    console.log("Sponsor percentage:", sponsorPercentage);
    const pointsToGive = points * 3 * sponsorPercentage;
    console.log("Points to give:", pointsToGive);

    // FOR SAFETY
    try {
      await prisma.points.update({
        where: {
          wallet: wallet,
        },
        data: {
          points: {
            increment: pointsToGive,
          },
        },
      });
    } catch (error) {
      console.log("No points record to update");
    }

    const sponsor = await prisma.user.update({
      where: {
        wallet: wallet,
      },
      data: {
        points: {
          increment: pointsToGive,
        },
      },
    });
  });

  await Promise.all(promises);

  return Response.json({ success: true });
}
