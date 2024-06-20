import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { bnToNumber } from "@/solana";

import prisma from "@/utils/prisma";

import { RPC, PROGRAM_ID } from "@/utils/constants";

import IDL from "@/solana/idl.json";
import { User } from "@prisma/client";

async function getTokenAccounts(program: anchor.Program, wallet: string) {
  try {
    const ownerFilter = [
      {
        memcmp: {
          offset: 8, // 8 bytes discriminator
          bytes: wallet, // owner
        },
      },
    ];

    const accounts = await program.account.tokenAccount.all(ownerFilter);

    return accounts;
  } catch (error) {
    console.error("Error get sponsor accounts:", error);
  }
}

export async function GET(request: Request) {
  const connection = new Connection(RPC);
  const programId = new PublicKey(PROGRAM_ID);

  const mockKeypair = Keypair.generate();

  const MockWallet = {
    signTransaction: () => Promise.reject(),
    signAllTransactions: () => Promise.reject(),
    publicKey: mockKeypair.publicKey,
  };

  const provider = new anchor.AnchorProvider(connection, MockWallet, anchor.AnchorProvider.defaultOptions());
  // @ts-ignore
  const program = new anchor.Program(IDL, programId, provider);

  try {
    // Fetch the specific user
    const users = await prisma.user.findMany({
      where: {
        points: {
          gt: 0,
        },
        updatedAt: {
          // TODO: figure out a better way to get game related points for sponsors
          gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2), // last 2 days
        },
      },
    });

    // sort users by points
    users.sort((a: User, b: User) => b.points - a.points);

    return Response.json({ success: true, data: users });
  } catch (error) {
    console.error("Error get sponsors:", error);
    return Response.json({ success: false });
  }
}
