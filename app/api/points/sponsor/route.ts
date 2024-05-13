import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Connection, PublicKey } from "@solana/web3.js";
import { bnToNumber } from "@/solana";

import prisma from "@/utils/prisma";

import { Player } from "@/types";
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
    console.error("Error fetching account info:", error);
    return 0;
  }
}

async function getSponsorAccounts(program: anchor.Program, wallet: string) {
  try {
    const walletPublicKey = new PublicKey(wallet);

    const ownerFilter = [
      {
        memcmp: {
          offset: 8,
          bytes: walletPublicKey.toBase58(),
        },
      },
    ];

    const accounts = program.account.tokenAccount.all(ownerFilter);

    return accounts;
  } catch (error) {
    console.error("Error fetching account info:", error);
  }
}

export async function POST(request: Request) {
  const data = await request.json();
  const { wallet, players } = data;

  const connection = new Connection(RPC);
  const programId = new PublicKey(PROGRAM_ID);

  const MockWallet = {
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
    publicKey: new PublicKey(wallet),
  };

  const provider = new anchor.AnchorProvider(connection, MockWallet, anchor.AnchorProvider.defaultOptions());
  // @ts-ignore
  const program = new anchor.Program(IDL, programId, provider);

  // 1. retrieve all token accounts by wallet address
  const accounts = (await getSponsorAccounts(program, wallet)) || [];

  let totalPoints = 0;

  for (const account of accounts) {
    // 2. for each subject, retrieve total shares
    // @ts-ignore
    const subject = account.account.subject.toBase58();
    const totalShares = await getTotalShares(program, subject);
    const sponsorShares = bnToNumber(account.account.amount as anchor.BN);

    if (sponsorShares === undefined || totalShares === undefined) {
      return Response.json({ success: false, message: "Error fetching shares" });
    }

    // 3. filter players by subject list to get point totals
    const subjectPoints = players.find((player: Player) => player.wallet === subject)?.points || 0;

    // 4. calculate what percentage per subject points to give
    const sponsorPercentage = sponsorShares / totalShares;
    const pointsToGive = subjectPoints * 3 * sponsorPercentage;

    // 5. add point totals and return
    totalPoints += pointsToGive;
  }

  return Response.json({ total: totalPoints.toFixed(0) });

  // const user = await prisma.points.findUnique({
  //   where: {
  //     wallet: wallet,
  //   },
  // });

  // if (!user) {
  //   return Response.json({ success: false, message: "User does not exist" });
  // }
}
