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
import { GAME_DATE } from "@/utils/constants";
import { set } from "date-fns";

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const [playerCount, setPlayerCount] = useState<number>(0);

  const router = useRouter();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

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

  useEffect(() => {
    const getPlayerCount = async () => {
      try {
        const time = new Date().toISOString();
        const response = await fetch(`/api/players/${time}`);
        const data = await response.json();
        setPlayerCount(data);
      } catch (error) {
        console.error(error);
      }
    };

    getPlayerCount();

    const interval = setInterval(() => {
      getPlayerCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

        {/* DESKTOP PLAYER CONTAINER */}
        {timeRemaining <= 60000 * 30 && (
          <>
            <div className={styles.playerContainer}>
              <div className={styles.progressBar}>
                <div>{Math.min(playerCount, 250)}/250</div>
                <div className={styles.progress}>
                  <div className={styles.progressFill} style={{ width: `${(playerCount / 250) * 100}%` }}></div>
                </div>
                <div>{Math.max(0, 250 - playerCount)} slots left</div>
              </div>
              <div className={styles.playerSection}>
                <Image src="/assets/graphics/timer/hunter.svg" alt="Hunter" width={27} height={72} />

                {playerCount < 250 ? (
                  <>
                    <span className={styles.playerTitle}>HUNTERS</span>
                    <div className={styles.arrows}>
                      {Array.from({ length: 9 }).map((_, index) => (
                        <Image key={index} src="/assets/graphics/timer/arrow.svg" alt="Arrow" width={13} height={10} />
                      ))}
                    </div>
                    <Image src="/assets/graphics/timer/join.svg" alt="Seeker" width={214} height={70} />
                  </>
                ) : (
                  <span className={styles.playerTitle}>HUNTERS LOCKED</span>
                )}
              </div>
              <div className={styles.spacer} />

              {/* SPONSOR SECTION */}
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

            <div className={styles.playerContainerMobile}>
              <div className={styles.progressBarMobile}>
                <div className={styles.progressBarTitle}>
                  <div>{Math.min(playerCount, 250)}/250</div>
                  <div>{Math.max(0, 250 - playerCount)} slots left</div>
                </div>
                <div className={styles.progress}>
                  <div className={styles.progressFill} style={{ width: `${(playerCount / 250) * 100}%` }}></div>
                </div>
              </div>
              {playerCount < 250 ? (
                <>
                  <div className={styles.playerSection}>
                    <Image src="/assets/graphics/timer/hunter.svg" alt="Hunter" width={27} height={72} />
                    <span className={styles.playerTitle}>HUNTERS</span>
                  </div>
                  <Link href="https://hunt.gg.zip" className={styles.joinButton}>Join hunt.gg.zip</Link>
                </>
              ) : (
                <span className={styles.playerTitle}>HUNTERS LOCKED</span>
              )}
              <div className={styles.spacer} />

              {/* SPONSOR SECTION */}
              <div className={styles.playerSection}>
                <Image src="/assets/graphics/timer/spectator.svg" alt="Spectator" width={27} height={72} />
                <span className={styles.playerTitle}>SPECTATORS</span>
              </div>
              <div className={styles.goToDesktop}>Go to Desktop</div>
            </div>
          </>
        )}
        <p>May the odds be ever in your favor anon</p>
        <Image src="/assets/icons/icons-24/box-green.svg" alt="Arrow down" width={24} height={24} />
      </div>
    </div>
  );
}
