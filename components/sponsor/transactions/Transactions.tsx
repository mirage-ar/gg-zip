import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./Transactions.module.css";

import { PublicKey } from "@solana/web3.js";
import { Player, TransactionData } from "@/types";
import { abbreviateString, formatDate, formatWalletAddress, wait, withCommas } from "@/utils";
import useSolana from "@/hooks/useSolana";

import { TRANSACTION_COUNT } from "@/utils/constants";

interface TransactionsProps {
  playerList: Player[];
  isProfile?: boolean;
}

const Transactions: React.FC<TransactionsProps> = ({ playerList, isProfile }) => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const { program } = useSolana();

  async function fetchTransactionsForProgram() {
    if (program === undefined) return;

    const programId = program.programId;
    const connection = program.provider.connection;

    const programPublicKey = new PublicKey(programId);
    const limit = TRANSACTION_COUNT;

    const signatures = await connection.getSignaturesForAddress(programPublicKey, {
      limit: limit,
    });

    let transactions: TransactionData[] = [];

    await Promise.all(
      signatures.map(async (signatureInfo) => {
        const transactionResponse = await connection.getTransaction(signatureInfo.signature);
        const logs = transactionResponse?.meta?.logMessages?.filter((message) => message.includes("Program log"));

        // Include only transactions that are buy or sell
        if (logs && logs[0]?.includes("Shares")) {
          const firstLog = logs[0];
          const transactiontype = firstLog
            .substring(firstLog.indexOf("Shares") - 4, firstLog.indexOf("Shares"))
            .replace(" ", "");

          const transaction: TransactionData = {
            type: transactiontype,
            amount: logs[1]?.substring(logs[1].indexOf("price: ") + 7),
            subject: logs[2]?.substring(logs[2].indexOf("subject: ") + 9),
            buyer: logs[3]?.substring(logs[3].indexOf("buyer: ") + 7),
            timestamp: Number(logs[4]?.substring(logs[4].indexOf("timestamp: ") + 11)),
            signature: transactionResponse?.transaction.signatures[0] || "",
          };

          transactions.push(transaction);
        }

        await wait(10);
      })
    );

    const orderedTransactions = transactions.sort((a, b) => b.timestamp - a.timestamp);
    setTransactions(orderedTransactions);
  }

  useEffect(() => {
    async function fetchTransactions() {
      await fetchTransactionsForProgram();
    }

    fetchTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, playerList]);

  return (
    <div className={styles.main}>
      {/* ----- HEADER ----- */}
      <div className={styles.header}>
        <span style={{ width: "90px" }}>Wallet</span>
        <span style={{ width: "50px" }}>Type</span>
        <span style={{ width: "150px" }}>Card</span>
        <span className={styles.priceHeader} style={{ width: "100px" }}>
          {isProfile ? "Earn" : "Price"}
          <Image src="/assets/icons/icons-24/solana.svg" alt="solana icon" width={24} height={24} />
        </span>
      </div>

      <div className={styles.transactions}>
        {transactions.map((transaction, index) => {
          const player = playerList.find((player) => player.wallet === transaction.subject);
          if (!player) {
            return null;
          }
          return (
            <div key={index} className={styles.transaction}>
              <div className={styles.walletContainer}>
                <p>{formatWalletAddress(transaction.buyer)}</p>
                <span>{formatDate(new Date(transaction.timestamp * 1000))}</span>
              </div>
              <p style={{ width: "50px" }}>{transaction.type}</p>
              <div className={styles.userContainer}>
                <Image src={player?.image || ""} alt="user" width={32} height={32} />
                <p>@{abbreviateString(player?.username)}</p>
              </div>
              <div className={styles.priceContainer}>
                <p>+ {withCommas((Number(transaction.amount) * 0.15).toFixed(3))}</p>
                {/* TODO: remove cluster get param on launch */}
                <Link href={`https://solscan.io/tx/${transaction.signature}?cluster=devnet`} target="_blank">
                  <Image src="/assets/icons/icons-16/transaction.svg" alt="transaction link" width={16} height={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transactions;
