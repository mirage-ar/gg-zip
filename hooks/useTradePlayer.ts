import { useState, useEffect, useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { SystemProgram } from "@solana/web3.js";
import { bnToNumber, getBuyPrice, getSellPrice } from "@/solana";

import IDL from "@/solana/idl.json";
import { PROGRAM_KEY } from "@/solana/constants";
import { set } from "date-fns";

export default function useTradePlayer(playerWalletAddress: string) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [cardHoldings, setCardHoldings] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      // @ts-ignore
      const program = new anchor.Program(IDL, PROGRAM_KEY, provider);
      return program;
    }
  }, [connection, anchorWallet]);

  async function fetchPlayerCardCount() {
    if (program === undefined) {
      console.error("Program is undefined");
      return;
    }

    try {
      const walletPublicKey = new anchor.web3.PublicKey(playerWalletAddress);
      const walletBuffer = walletPublicKey.toBuffer();

      const [mintPda, mintBump] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

      const playerAccount = await program.account.mintAccount.fetch(mintPda);
      const playerCardCount = bnToNumber(playerAccount.amount as anchor.BN);

      return playerCardCount;
    } catch (error) {
      console.error(error);
    }
  }

  async function buyPlayerCard() {
    console.log("here");
    if (!program || !publicKey) {
      // TODO: update these errors
      console.error("Program is undefined");
      return;
    }

    try {
      setLoading(true);
      const subjectPublicKey = new anchor.web3.PublicKey(playerWalletAddress);
      const subjectBuffer = subjectPublicKey.toBuffer();

      // Ensure the seeds order and buffers are correctly set
      const [tokenPda] = await findProgramAddressSync(
        [Buffer.from("TOKEN"), publicKey.toBuffer(), subjectBuffer],
        program.programId
      );

      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);

      const [protocolPda] = await findProgramAddressSync([Buffer.from("PROTOCOL")], program.programId);

      const [potPda] = await findProgramAddressSync([Buffer.from("POT")], program.programId);

      const tx = await program.methods
        .buyShares(subjectPublicKey, new anchor.BN(1))
        .accounts({
          authority: publicKey,
          token: tokenPda,
          mint: mintPda,
          protocol: protocolPda,
          pot: potPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log(tx);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function sellPlayerCard() {
    if (!program || !publicKey) {
      // TODO: update these errors
      console.error("Program is undefined");
      return;
    }

    try {
        setLoading(true);
        const subjectPublicKey = new anchor.web3.PublicKey(playerWalletAddress);
        const subjectBuffer = subjectPublicKey.toBuffer();
  
        // Ensure the seeds order and buffers are correctly set
        const [tokenPda] = await findProgramAddressSync(
          [Buffer.from("TOKEN"), publicKey.toBuffer(), subjectBuffer],
          program.programId
        );
  
        const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);
  
        const [protocolPda] = await findProgramAddressSync([Buffer.from("PROTOCOL")], program.programId);
  
        const [potPda] = await findProgramAddressSync([Buffer.from("POT")], program.programId);
  
        const tx = await program.methods
          .sellShares(subjectPublicKey, new anchor.BN(1))
          .accounts({
            authority: publicKey,
            token: tokenPda,
            mint: mintPda,
            protocol: protocolPda,
            pot: potPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
  
        console.log(tx);
  
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
  }

  async function fetchCardHoldings(): Promise<number> {
    if (program === undefined || !publicKey) {
      // TODO: update these errors
      console.error("Program is undefined or no public key found");
      return 0;
    }

    try {
      const walletPublicKey = new anchor.web3.PublicKey(playerWalletAddress);
      const walletBuffer = walletPublicKey.toBuffer();

      const [tokenPda] = await findProgramAddressSync(
        [Buffer.from("TOKEN"), publicKey.toBuffer(), walletBuffer],
        program.programId
      );

      const tokenAccount = await program.account.tokenAccount.fetch(tokenPda);

      if (tokenAccount) {
        const tokenCount = bnToNumber(tokenAccount.amount as anchor.BN);
        return tokenCount || 0;
      }
    } catch (error: any) {
      console.error("Error fetching token account:", error);
      if (error.message.includes("Account does not exist")) {
        return 0; // Return 0 if the account does not exist
      }
      throw error;
    }
    return 0;
  }

  async function fetchPrices() {
    if (program === undefined) {
      console.error("Program is undefined");
      return;
    }

    try {
      const playerCardCount = await fetchPlayerCardCount();
      if (playerCardCount === undefined) {
        console.error("Player card count is undefined");
        return;
      }

      const buyPrice = getBuyPrice(playerCardCount, 1);
      const sellPrice = getSellPrice(playerCardCount, 1);

      setBuyPrice(buyPrice);
      setSellPrice(sellPrice);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function init() {
      if (program === undefined) {
        console.error("Program is undefined");
        return;
      }

      fetchPrices();
      setCardHoldings(await fetchCardHoldings());
    }

    init();
  }, [program]);

  return { program, buyPrice, sellPrice, cardHoldings, loading, buyPlayerCard, sellPlayerCard };
}
