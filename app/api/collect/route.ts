import * as anchor from "@project-serum/anchor";
import prisma from "@/utils/prisma";

import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import bs58 from "bs58"; // Base58 library

import { RPC, PROGRAM_ID, TOKEN_MINT_ADDRESS } from "@/utils/constants";

import IDL from "@/solana/idl.json";

import { rand } from "@/utils";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// SOLANA CONNECTION AND WALLET SETUP
const connection = new Connection(RPC);

const base58PrivateKey = PRIVATE_KEY;
const secretKey = bs58.decode(base58PrivateKey);
const payer = Keypair.fromSecretKey(secretKey);

async function sendTokens(points: number, wallet: string) {
  // Send SPL Token
  const recipientPublicKey = new PublicKey(wallet);
  const tokenMint = new PublicKey(TOKEN_MINT_ADDRESS);

  // Get or create associated token accounts for payer and recipient
  const recipientTokenAccount = await getAssociatedTokenAddress(tokenMint, recipientPublicKey);
  const payerTokenAccount = await getAssociatedTokenAddress(tokenMint, payer.publicKey);

  // Transfer tokens from payer to recipient
  const amountToSend = points * 1000000; // Adjust for 6 decimals

  const transaction = new Transaction();

  // Ensure the recipient has an associated token account
  const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
  if (!recipientAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer.publicKey, // Payer funding the account creation
        recipientTokenAccount, // Associated token account
        recipientPublicKey, // The recipient's public key
        tokenMint // Mint address
      )
    );
  }

  // Create transfer instruction
  transaction.add(
    createTransferInstruction(
      payerTokenAccount, // Sender token account
      recipientTokenAccount, // Recipient token account
      payer.publicKey, // Owner of the sender's account
      amountToSend, // Amount in smallest token units
      [], // Signers if necessary
      TOKEN_PROGRAM_ID // SPL Token Program ID - testing
    )
  );

  // Send and confirm the transaction
  const signature = await connection.sendTransaction(transaction, [payer]);
  await connection.confirmTransaction(signature);
  console.log("Transaction successful:", signature);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { subject, points } = data;

  // Send tokens to the subject
  await sendTokens(points, subject);

  return Response.json({ success: true });
}
