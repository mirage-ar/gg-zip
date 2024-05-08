"use client";

import React, { useEffect, useState } from "react";
import TradingView from "@/components/sponsor/trade/TradingView";
import Image from "next/image";

import styles from "./LiveLeaderboard.module.css";
import { Player, MarkersObject } from "@/types";
import { rand, withCommas } from "@/utils";
import { API } from "@/utils/constants";

import { getBuyPrice, getSellPrice } from "@/solana";
import useProgram from "@/hooks/useProgram";
import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import BN from "bn.js";
import { Program } from "@project-serum/anchor";
import { bnToNumber } from "@/solana";

interface LiveLeaderboardProps {
  flyToMarker: (markerId: string) => void;
  markersRef: any;
  displaySponsorCards?: boolean;
  sponsorHoldings?: string[];
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  flyToMarker,
  markersRef,
  displaySponsorCards = false,
  sponsorHoldings,
}) => {
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);

  const { program } = useProgram();

  const fetchData = async (displaySponsorCards: boolean) => {
    if (program === undefined) return;
    try {
      const response = await fetch(`${API}/leaderboard`);
      // const data = await response.json();
      const data: { leaderboard: Player[] } = {
        leaderboard: [],
      };
      const leaderboardArray: Player[] = [
        {
          id: "1780313261801455616",
          username: "fiigmnt",
          image: "https://pbs.twimg.com/profile_images/1780348989918871552/23xCIF0T.jpg",
          points: 1287,
          boxes: 5,
          wallet: "FG22CkapS12Qj5MdwH8p6Mb8UqxB7BDTaJkkc3x6PJ1a",
        },
        {
          id: "1780313261801455618",
          username: "celia",
          image: "https://pbs.twimg.com/profile_images/1780348989918871552/23xCIF0T.jpg",
          points: 560,
          boxes: 2,
          wallet: "6zKmdKcZrWMKSDPSJPArGZzTcrRUrsdRg6qARDhhqUEF",
        },
      ];

      for (const player of leaderboardArray) {
        // Convert the wallet public key from base58 to a Buffer
        const walletPublicKey = new PublicKey(player.wallet);
        const walletBuffer = walletPublicKey.toBuffer();

        const [mintPda, mintBump] = await findProgramAddressSync(
          [Buffer.from("MINT"), walletBuffer],
          program.programId
        );

        const playerAccount = await program.account.mintAccount.fetch(mintPda);
        const playerCardCount = bnToNumber(playerAccount.amount as BN);

        if (playerCardCount === undefined) {
          console.error("Player card count is undefined");
          return player;
        }

        player.buyPrice = getBuyPrice(playerCardCount, 1);
        player.sellPrice = getSellPrice(1, playerCardCount);
      }

      data.leaderboard = leaderboardArray;
      const leaderboard = data.leaderboard.sort((a: Player, b: Player) => b.points - a.points);
      const holdingPlayers = leaderboard.filter((player: Player) => sponsorHoldings?.includes(player.id));
      setLeaderboardData(displaySponsorCards ? holdingPlayers : leaderboard);
    } catch (error) {
      console.error(error);
    }
  };

  const checkOnlineUsers = () => {
    if (markersRef.current) {
      const markers = markersRef.current;
      const onlineUsers = Object.keys(markers);
      setOnlineUsers(onlineUsers);
    }
  };

  useEffect(() => {
    console.log(program);
    if (program === undefined) return;
    const fetchDataAndCheckUsers = async () => {
      await fetchData(displaySponsorCards);
      checkOnlineUsers();
    };

    fetchDataAndCheckUsers();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchDataAndCheckUsers();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [displaySponsorCards, program]);

  function openTradingView(player: Player, rank: number) {
    player.rank = rank;
    setTradingViewPlayer(player);
    setShowOverlay(true);
  }

  return (
    <div>
      {/* ----- TRADING VIEW ----- */}
      {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}

      {/* ----- HEADER ----- */}
      <div className={styles.header}>
        <div className={styles.leftColumn}>
          <span>Rank</span>
          <span>Name</span>
          <span>
            <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
          </span>
          <span>
            <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Coin Icon" width={24} height={24} />
          </span>
        </div>
        <div className={styles.rightColumn}>
          <span>Price</span>
        </div>
      </div>

      {/* ----- LEADERBOARD ------ */}
      {leaderboardData.length > 0 &&
        leaderboardData.map(
          (player, index) =>
            player.points > 0 && (
              <div key={player.id}>
                <div className={styles.leaderboardRow}>
                  <div className={styles.playerInfo} onClick={() => flyToMarker(player.id)}>
                    <div className={styles.playerRank}>{index + 1}</div>
                    <div className={styles.playerMarker}>
                      {onlineUsers.includes(player.id) && <div className={styles.onlineMarker} />}
                      <Image
                        className={`${styles.playerImage} ${onlineUsers.includes(player.id) && styles.online}`}
                        src={player.image}
                        alt="User Image"
                        width={150}
                        height={150}
                      />
                    </div>
                    <div className={styles.playerNameContainer}>
                      <div className={styles.playerName}>@{player.username}</div>
                      <div className={styles.playerScoreContainer}>
                        <div className={styles.playerScore}>{withCommas(player.points)}</div>
                        <div className={styles.dot}>•</div>
                        <div className={styles.playerBoxes}>{withCommas(player.boxes)}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceContainer}>
                    <div className={styles.price}>{withCommas(player.buyPrice || 0)}</div>
                    {/* TODO: add Solana logo here */}
                    <button className={styles.tradeButton} onClick={() => openTradingView(player, index + 1)}>
                      Trade
                    </button>
                  </div>
                </div>
                {index === 4 && <div className={styles.spacer} />}
              </div>
            )
        )}
    </div>
  );
};

export default LiveLeaderboard;
