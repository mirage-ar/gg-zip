"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./LiveLeaderboard.module.css";
import { LeaderboardItem, LiveLeaderboardItem } from "@/types";
import { rand, withCommas } from "@/utils";

const LiveLeaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LiveLeaderboardItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/leaderboard/${rand(1, 100)}`);
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
              <div className={styles.leaderboardRow} key={player.id}>
                <div className={styles.playerInfo}>
                  <div className={styles.playerRank}>{index + 1}</div>
                  {/* <div className={styles.playerMarker}> */}
                  <Image className={styles.playerImage} src={player.image} alt="User Image" width={150} height={150} />
                  {/* </div> */}
                  <div className={styles.playerName}>@{player.username}</div>
                </div>
                <div className={styles.playerBoxes}>{withCommas(player.box)}</div>
                <div className={styles.playerScore}>{withCommas(player.points)}</div>
              </div>
            ))}
    </div>
  );
};

export default LiveLeaderboard;
