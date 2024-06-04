"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import styles from "./page.module.css";

import Timer from "@/components/utility/Timer";
import MapboxMap from "@/components/map/MapboxMap";

import { MarkersObject } from "@/types";
import { getGameStartTime } from "@/utils";
import { GAME_API, GAME_DATE, PLAYER_COUNT, POLLING_TIME, PAUSE } from "@/utils/constants";
import UserInfo from "@/components/user/UserInfo";
import { useUser } from "@/hooks";

const FIVE_MINUTES = 1000 * 60 * 5;

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});
  const [playerCount, setPlayerCount] = useState<number>(0);

  const { connectWallet, publicKey } = useUser();

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const targetTime = getGameStartTime(GAME_DATE); // Month is 0-indexed, 3 = April
    return targetTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  // TODO: turn player count on before next game
  // useEffect(() => {
  //   const getPlayerCount = async () => {
  //     try {
  //       const response = await fetch(`${GAME_API}/players`);
  //       const data = await response.json();
  //       setPlayerCount(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   getPlayerCount();

  //   const interval = setInterval(() => {
  //     if (document.visibilityState === "visible") {
  //       getPlayerCount();
  //     }
  //   }, POLLING_TIME);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <UserInfo />
      <div className={styles.main}>
        <div className={styles.map}>
          <MapboxMap mapRef={mapRef} markersRef={markersRef} isHomePage />
        </div>
        <div className={styles.mainContainer}>
          {PAUSE ? (
            <Image src="/assets/graphics/pause.svg" alt="Arrow down" width={1000} height={1000} />
          ) : (
            <>
              <div className={styles.timerContainer}>
                <p>The hunt will start in</p>
                <div style={{ fontSize: "108px" }}>
                  <Timer timeRemaining={timeRemaining} />
                </div>
              </div>

              <p>May the odds be ever in your favor anon</p>
              <Image src="/assets/icons/icons-24/box-green.svg" alt="Arrow down" width={24} height={24} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
