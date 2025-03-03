"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./Winners.module.css";
import { Player, MarkersObject } from "@/types";
import { rand, withCommas } from "@/utils";
import { set } from "date-fns";
import { GAME_API } from "@/utils/constants";

interface LiveLeaderboardProps {
  flyToMarker: (markerId: string) => void;
  markersRef: any;
}

const Winners: React.FC<LiveLeaderboardProps> = ({ flyToMarker, markersRef }) => {
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${GAME_API}/leaderboard`);
      const data = await response.json();
      const leaderboard = data.leaderboard.sort((a: Player, b: Player) => b.points - a.points);
      setLeaderboardData(leaderboard);
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
    const fetchDataAndCheckUsers = () => {
      fetchData();
      checkOnlineUsers();
    };

    fetchDataAndCheckUsers();
    // const interval = setInterval(() => {
    //   if (document.visibilityState === "visible") {
    //     fetchDataAndCheckUsers();
    //   }
    // }, 5000);

    // return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        leaderboardData.map(
          (player, index) =>
            index < 5 && (
              <div className={`${index < 5 ? styles.green : ""}`} key={player.id}>
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
                    <div className={styles.playerName}>@{player.username}</div>
                  </div>
                  <div className={styles.playerBoxes}>{withCommas(player.boxes)}</div>
                  <div className={styles.playerScore}>{withCommas(player.points)}</div>
                </div>
                {index === 4 && <div className={styles.spacer} />}
              </div>
            )
        )}
    </div>
  );
};

export default Winners;
