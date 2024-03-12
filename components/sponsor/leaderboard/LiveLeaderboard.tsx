"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./LiveLeaderboard.module.css";
import { LiveLeaderboardItem } from "@/types";
import { rand, withCommas } from "@/utils";

interface LiveLeaderboardProps {
  flyToMarker: (markerId: string) => void;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ flyToMarker }) => {
  const [leaderboardData, setLeaderboardData] = useState<LiveLeaderboardItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/leaderboard/${rand(1, 100)}`);
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* ----- HEADER ----- */}
      <div className={styles.header}>
        <div className={styles.leftColumn}>
          <span>Rank</span>
          <span>Name</span>
        </div>
        <div className={styles.rightColumn}>
          <span>
            <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Coin Icon" width={24} height={24} />
          </span>
          <span>
            <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
          </span>
        </div>
      </div>

      {/* ----- LEADERBOARD ------ */}
      {leaderboardData.length > 0 &&
        leaderboardData.map((player, index) => (
          <div className={`${index < 5 ? styles.green : ""}`} key={player.id}>
            <div className={styles.leaderboardRow}>
              <div className={styles.playerInfo} onClick={() => flyToMarker(player.id)}>
                <div className={styles.playerRank}>{index + 1}</div>
                {/* <div className={styles.playerMarker}> */}
                <Image className={styles.playerImage} src={player.image} alt="User Image" width={150} height={150} />
                {/* </div> */}
                <div className={styles.playerName}>@{player.username}</div>
              </div>
              <div className={styles.playerBoxes}>{withCommas(player.boxes)}</div>
              <div className={styles.playerScore}>{withCommas(player.points)}</div>
            </div>
            {index === 4 && <div className={styles.spacer} />}
          </div>
        ))}
    </div>
  );
};

export default LiveLeaderboard;
