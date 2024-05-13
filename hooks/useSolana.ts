import { useState, useEffect, useMemo } from "react";
import * as anchor from "@project-serum/anchor";

import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { SystemProgram, PublicKey, Transaction } from "@solana/web3.js";
import { useApplicationContext } from "@/state/context";
import { bnToNumber, getBuyPrice, getSellPrice } from "@/solana";
import { wait } from "@/utils";

import { PROGRAM_ID } from "@/utils/constants";

import IDL from "@/solana/idl.json";

export default function useSolana(playerWalletAddress?: string) {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [cardHoldings, setCardHoldings] = useState<number>(0);

  const { publicKey, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  // TODO: use transaction pending from context in UI
  const { setTransactionPending } = useApplicationContext();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      const programKey = new PublicKey(PROGRAM_ID);
      // @ts-ignore
      const program = new anchor.Program(IDL, programKey, provider);
      return program;
    }
  }, [connection, anchorWallet]);

  async function fetchPlayerCardCount() {
    if (!program || !playerWalletAddress) {
      return;
    }

    try {
      const walletPublicKey = new PublicKey(playerWalletAddress);
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
    if (!program || !publicKey || !playerWalletAddress) {
      return;
    }

    try {
      setTransactionPending(true);
      const subjectPublicKey = new PublicKey(playerWalletAddress);
      const subjectBuffer = subjectPublicKey.toBuffer();

      // Ensure the seeds order and buffers are correctly set
      const [tokenPda] = await findProgramAddressSync(
        [Buffer.from("TOKEN"), publicKey.toBuffer(), subjectBuffer],
        program.programId
      );

      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);
      const [protocolPda] = await findProgramAddressSync([Buffer.from("PROTOCOL")], program.programId);
      const [potPda] = await findProgramAddressSync([Buffer.from("POT")], program.programId);

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const transaction = new Transaction().add(
        await program.methods
          .buyShares(subjectPublicKey, new anchor.BN(1))
          .accounts({
            authority: publicKey,
            token: tokenPda,
            mint: mintPda,
            protocol: protocolPda,
            pot: potPda,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log(confirmation);

      wait(5000); // TODO: remove when realtime update to points is fixed
      setTransactionPending(false);
    } catch (error) {
      console.error(error);
      setTransactionPending(false);
    }
  }

  async function sellPlayerCard() {
    if (!program || !publicKey || !playerWalletAddress) {
      return;
    }

    try {
      setTransactionPending(true);
      const subjectPublicKey = new PublicKey(playerWalletAddress);
      const subjectBuffer = subjectPublicKey.toBuffer();

      // Ensure the seeds order and buffers are correctly set
      const [tokenPda] = await findProgramAddressSync(
        [Buffer.from("TOKEN"), publicKey.toBuffer(), subjectBuffer],
        program.programId
      );

      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);
      const [protocolPda] = await findProgramAddressSync([Buffer.from("PROTOCOL")], program.programId);
      const [potPda] = await findProgramAddressSync([Buffer.from("POT")], program.programId);

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const transaction = new Transaction().add(
        await program.methods
          .sellShares(subjectPublicKey, new anchor.BN(1))
          .accounts({
            authority: publicKey,
            token: tokenPda,
            mint: mintPda,
            protocol: protocolPda,
            pot: potPda,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
      );

      const signature = await sendTransaction(transaction, connection, { minContextSlot });
      const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log(confirmation);

      setTransactionPending(false);
    } catch (error) {
      console.error(error);
      setTransactionPending(false);
    }
  }

  async function fetchCardHoldings(): Promise<number> {
    if (!program || !publicKey || !playerWalletAddress) {
      return 0;
    }

    try {
      const walletPublicKey = new PublicKey(playerWalletAddress);
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
    }
    return 0;
  }

  async function fetchSponsorHoldings(): Promise<string[]> {
    if (!program || !publicKey) {
      return [];
    }

    try {
      const ownerFilter = [
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58(),
          },
        },
      ];

      const accounts = await program.account.tokenAccount.all(ownerFilter);
      // @ts-ignore
      const holdings = accounts.map((account) => account.account.subject.toBase58());

      return holdings;
    } catch (error) {
      console.error("Error fetching sponsor holdings:", error);
      return [];
    }
  }

  async function fetchPrices() {
    if (!program || !playerWalletAddress) {
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
      fetchPrices();
      setCardHoldings(await fetchCardHoldings());
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  return { program, buyPrice, sellPrice, cardHoldings, buyPlayerCard, sellPlayerCard, fetchSponsorHoldings };
}
