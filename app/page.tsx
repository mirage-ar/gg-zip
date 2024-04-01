"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import styles from "./page.module.css";

import Timer from "@/components/utility/Timer";
import MapboxMap from "@/components/map/MapboxMap";

import { MarkersObject } from "@/types";
import { getNoonEasternTime } from "@/utils";
import { GAME_DATE } from "@/utils/constants";


export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const router = useRouter();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const targetTime = getNoonEasternTime(GAME_DATE); // Month is 0-indexed, 3 = April
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

  // useEffect(() => {
  //   if (timeRemaining <= 60000 && publicKey) {
  //     router.push("/hunt");
  //   }
  // }, [timeRemaining, publicKey]);

  const handleConnectWallet = async () => {
    try {
      if (!publicKey) {
        setVisible(true);
        return;
      }
      router.push("/hunt");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.map}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} isHomePage />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.timerContainer}>
          <p>The hunt will start in</p>
          <Timer timeRemaining={timeRemaining} />
        </div>

        {timeRemaining <= 60000 && ( // TODO: how long before the hunt starts should this be visible?
          <div className={styles.playerContainer}>
            <div className={styles.playerSection}>
              <Image src="/assets/graphics/timer/hunter.svg" alt="Hunter" width={27} height={72} />
              <span className={styles.playerTitle}>HUNTERS</span>
              <div className={styles.arrows}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <Image key={index} src="/assets/graphics/timer/arrow.svg" alt="Arrow" width={13} height={10} />
                ))}
              </div>
              <Image src="/assets/graphics/timer/join.svg" alt="Seeker" width={214} height={70} />
            </div>
            <div className={styles.spacer} />
            <div className={styles.playerSection}>
              <Image src="/assets/graphics/timer/spectator.svg" alt="Spectator" width={27} height={72} />
              <span className={styles.playerTitle}>SPECTATORS</span>
              <div className={styles.arrows}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Image key={index} src="/assets/graphics/timer/arrow.svg" alt="Arrow" width={13} height={10} />
                ))}
              </div>
              {/* <Image src="/assets/graphics/timer/connect.svg" alt="Connect" width={214} height={70} /> */}
              <button className={styles.connectButton} onClick={handleConnectWallet}>
                {publicKey ? "Click to Join" : "Connect Wallet to Join"}
              </button>
            </div>
          </div>
        )}
        <p>May the odds be ever in your favor anon</p>
        <Image src="/assets/icons/icons-24/box-green.svg" alt="Arrow down" width={24} height={24} />
      </div>
    </div>
  );
}
