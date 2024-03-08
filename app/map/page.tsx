"use client";

import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import styles from "./page.module.css";
import React from "react";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";

enum Tab {
  LEADERBOARD = 0,
  CHAT = 1,
}

export default function Home() {
  const tabs = [Tab.LEADERBOARD, Tab.CHAT];
  const [tab, setTab] = React.useState(Tab.LEADERBOARD);

  return (
    <div className={styles.main}>
      <MapboxMap />
      <div className={styles.overlay}>
        {/* ----- PRIZE INFO ----- */}
        <div className={styles.prizeTotal}>
          <div className={styles.prizeTotalLabel}> Prize Pool</div>
          <div className={styles.prizeContainer}>
            <Image src="/assets/icons/point-container-left.svg" alt="Prize graphic" width={153} height={109} />
            <div className={styles.prizeTotalAmount}>
              1,000,000
              <Image src="/assets/icons/icons-24/g.svg" alt="G icon" width={36} height={36} />
            </div>
            <Image src="/assets/icons/point-container-right.svg" alt="Prize graphic" width={153} height={109} />
          </div>
        </div>

        {/* ----- NAVIGATION ----- */}
        <div className={styles.navContainer}>
          <div
            className={`${styles.navButton} ${tab === Tab.LEADERBOARD ? styles.selected : ""}`}
            onClick={() => setTab(Tab.LEADERBOARD)}
          >
            <Image
              src={`/assets/icons/icons-24/leaderboard-${tab === Tab.LEADERBOARD ? "black" : "white"}.svg`}
              alt="Leaderboard"
              width={24}
              height={24}
            />
            Leaderboard
          </div>
          <div
            className={`${styles.navButton} ${tab === Tab.CHAT ? styles.selected : ""}`}
            onClick={() => setTab(Tab.CHAT)}
          >
            <Image
              src={`/assets/icons/icons-24/chat-${tab === Tab.CHAT ? "black" : "white"}.svg`}
              alt="Leaderboard"
              width={24}
              height={24}
            />
            Chat
          </div>
        </div>

        {/* ----- COMPONENTS ----- */}
        {tab === Tab.LEADERBOARD ? (
          <LiveLeaderboard />
        ) : (
          <Chat />
        )}
      </div>
    </div>
  );
}
