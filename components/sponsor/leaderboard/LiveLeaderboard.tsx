"use client";

import React, { useEffect, useState } from "react";
import TradingView from "@/components/sponsor/trade/TradingView";
import Image from "next/image";

import styles from "./LiveLeaderboard.module.css";
import { Player } from "@/types";
import { withCommas } from "@/utils";

interface LiveLeaderboardProps {
  flyToMarker: (markerId: string) => void;
  markersRef: any;
  playerList: Player[];
  onlineUsers: string[];
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ flyToMarker, markersRef, playerList, onlineUsers }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);

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
      {playerList.length > 0 &&
        playerList.map(
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
                    <div className={styles.price}>{withCommas(player.buyPrice?.toFixed(3) || 0)}</div>
                    {/* TODO: add Solana logo here */}
                    <button
                      className={styles.tradeButton}
                      disabled={!player.buyPrice}
                      onClick={() => openTradingView(player, index + 1)}
                    >
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
