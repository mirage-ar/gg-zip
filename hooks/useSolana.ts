import { useState, useEffect, useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { SystemProgram, PublicKey, Transaction } from "@solana/web3.js";
import { useApplicationContext } from "@/state/ApplicationContext";
import { bnToNumber, getBuyPrice, getSellPrice } from "@/solana";
import BN from "bn.js";

import type { Player, SponsorHoldings } from "@/types";
import { PROGRAM_ID } from "@/utils/constants";

import IDL from "@/solana/idl.json";

import { wait } from "@/utils";
import { hostname } from "os";

export default function useSolana(playerWalletAddress?: string) {
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [cardHoldings, setCardHoldings] = useState<number>(0);

  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

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

  async function fetchPlayerCardCount(playerWalletAddress: string) {
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
      // If the account does not exist, return 0
      return 0;
    }
  }

  async function buyPlayerCard(amount: number) {
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

      // const {
      //   context: { slot: minContextSlot },
      //   value: { blockhash, lastValidBlockHeight },
      // } = await connection.getLatestBlockhashAndContext();

      const transaction = await program.methods
        .buyShares(subjectPublicKey, new anchor.BN(amount))
        .accounts({
          authority: publicKey,
          token: tokenPda,
          mint: mintPda,
          protocol: protocolPda,
          pot: potPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // const signature = await sendTransaction(transaction, connection, { minContextSlot });
      // console.log(signature);
      // const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      console.log(transaction);
    } catch (error) {
      console.error("buyPlayerCard", error);
      throw new Error("Failed to buy player card");
    } finally {
      setTransactionPending(false);
    }
  }

  async function sellPlayerCard(amount: number) {
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

      const transaction = await program.methods
        .sellShares(subjectPublicKey, new anchor.BN(amount))
        .accounts({
          authority: publicKey,
          token: tokenPda,
          mint: mintPda,
          protocol: protocolPda,
          pot: potPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // const signature = await sendTransaction(transaction, connection, { minContextSlot });
      // const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      console.log("Transaction: ", transaction);
    } catch (error) {
      console.error("sellPlayerCard", error);
      throw new Error("Failed to sell player card");
    } finally {
      setTransactionPending(false);
    }
  }

  async function mintPlayerCard(): Promise<{ success: boolean; message?: string }> {
    if (!program || !publicKey) {
      return { success: false, message: "No program or public key found." };
    }

    try {
      setTransactionPending(true);
      const subjectPublicKey = publicKey;
      const subjectBuffer = subjectPublicKey.toBuffer();

      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);
      const [protocolPda] = await findProgramAddressSync([Buffer.from("PROTOCOL")], program.programId);

      // const {
      //   context: { slot: minContextSlot },
      //   value: { blockhash, lastValidBlockHeight },
      // } = await connection.getLatestBlockhashAndContext();

      const transaction = await program.methods
        .mint()
        .accounts({
          authority: publicKey,
          mint: mintPda,
          protocol: protocolPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // const signature = await sendTransaction(transaction, connection, { minContextSlot });
      // console.log(signature);
      // const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
      return { success: true };
    } catch (error) {
      console.error("mintPlayerCard", error);
      // @ts-ignore
      return { success: false, message: error?.message || "Failed to mint player card" };
    } finally {
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
      // If the account does not exist, return 0
      return 0;
    }
    return 0;
  }

  async function calculateTotalHoldings(playerList: Player[], sponsorHoldings: string[]): Promise<number> {
    if (!program || !publicKey) {
      return 0;
    }

    // TODO: remove playerlist, clean this up
    // const holdingPlayers = playerList.filter((player: Player) => sponsorHoldings.includes(player.wallet));

    let totalHoldings = 0;
    await Promise.all(
      sponsorHoldings.map(async (wallet) => {
        try {
          // fetch how much of each player the sponsor holds
          const walletPublicKey = new PublicKey(wallet);
          const walletBuffer = walletPublicKey.toBuffer();

          const [tokenPda] = await findProgramAddressSync(
            [Buffer.from("TOKEN"), publicKey.toBuffer(), walletBuffer],
            program.programId
          );

          const tokenAccount = await program.account.tokenAccount.fetch(tokenPda);

          const tokenTotal = await fetchPlayerCardCount(wallet);

          if (tokenAccount && tokenTotal) {
            const tokenCount = bnToNumber(tokenAccount.amount as BN);

            let totalSellPrice: number = 0;

            for (let i = 0; i < tokenCount; i++) {
              const currentPrice = getSellPrice(tokenTotal - i, 1);
              totalSellPrice += currentPrice;
            }

            totalHoldings += totalSellPrice;
          }
        } catch (error) {
          console.error("calculateTotalHoldings", error);
          throw new Error(`Failed to calculate total holdings: ${error}`);
        } finally {
          return totalHoldings;
        }
      })
    );

    return totalHoldings;
  }

  async function fetchSponsorHoldings(wallet?: string): Promise<SponsorHoldings[]> {
    if (!program || !publicKey) {
      return [];
    }

    try {
      const ownerFilter = [
        {
          memcmp: {
            offset: 8,
            bytes: wallet || publicKey.toBase58(),
          },
        },
      ];

      const accounts = await program.account.tokenAccount.all(ownerFilter);

      let holdings: SponsorHoldings[];

      holdings = accounts.map((account) => {
        return {
          // @ts-ignore
          wallet: account.account.subject.toBase58(),
          amount: bnToNumber(account.account.amount as anchor.BN),
          percentage: 0,
        };
      });

      if (!holdings.length) {
        return [];
      }

      // FOR SPONSOR LEADERBOARD - REDUCE TO TOP 10
      if (wallet) {
        holdings = holdings.slice(0, 10);
      }
        for (const holding of holdings) {
          const playerCardCount = await fetchPlayerCardCount(holding.wallet);
          if (playerCardCount) {
            holding.percentage = (holding.amount / playerCardCount) * 100;
          }
        }

      // UPDATE: Filter out holdings with 0 amount
      return holdings.filter((holding) => holding.amount > 0);
    } catch (error) {
      console.error("fetchSponsorHoldings", error);
      return [];
    }
  }

  const isMinted = async () => {
    if (!program || !publicKey) {
      return false;
    }

    try {
      const subjectPublicKey = publicKey;
      const subjectBuffer = subjectPublicKey.toBuffer();
      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);

      // Fetch the account info for the mint PDA
      const accountInfo = await program.provider.connection.getAccountInfo(mintPda);

      // If accountInfo is not null, the account exists
      return accountInfo !== null;
    } catch (error) {
      console.error("isMinted", error);
      return false;
    }
  };

  async function fetchPrices() {
    if (!program || !playerWalletAddress) {
      return;
    }

    try {
      const playerCardCount = await fetchPlayerCardCount(playerWalletAddress);
      if (playerCardCount === undefined) {
        return;
      }

      const buyPrice = getBuyPrice(playerCardCount, 1);
      const sellPrice = getSellPrice(playerCardCount, 1);

      setBuyPrice(buyPrice);
      setSellPrice(sellPrice);
    } catch (error) {
      console.error("fetchPrices", error);
    }
  }

  async function getPlayerMintAccount(playerWalletAddress: string) {
    if (!program || !playerWalletAddress) {
      return;
    }

    try {
      const walletPublicKey = new PublicKey(playerWalletAddress);
      const walletBuffer = walletPublicKey.toBuffer();

      const [mintPda, mintBump] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

      const balance = await connection.getBalance(mintPda);
      const playerAccount = await program.account.mintAccount.fetch(mintPda);

      return {
        ...playerAccount,
        balance,
      };
    } catch (error) {
      console.error("getPlayerMintAccount", error);
    }
  }

  async function withdrawFromMint() {
    if (!program || !publicKey) {
      return;
    }

    try {
      setTransactionPending(true);
      const subjectPublicKey = publicKey;
      const subjectBuffer = subjectPublicKey.toBuffer();

      const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), subjectBuffer], program.programId);

      const transaction = await program.methods
        .withdrawFromMint()
        .accounts({
          authority: publicKey,
          mint: mintPda,
        })
        .rpc();

      console.log(transaction);
    } catch (error) {
      console.error("withdrawFromMint", error);
    } finally {
      setTransactionPending(false);
    }
  }

  useEffect(() => {
    async function init() {
      fetchPrices();
      const cardHoldings = await fetchCardHoldings();
      setCardHoldings(cardHoldings);
    }

    if (playerWalletAddress) {
      init();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, playerWalletAddress]);

  return {
    program,
    buyPrice,
    sellPrice,
    cardHoldings,
    buyPlayerCard,
    sellPlayerCard,
    mintPlayerCard,
    calculateTotalHoldings,
    fetchSponsorHoldings,
    fetchPlayerCardCount,
    isMinted,
    getPlayerMintAccount,
    withdrawFromMint,
  };
}
