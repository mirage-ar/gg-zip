"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Timer from "@/components/utility/Timer";

import styles from "./GameTimer.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";

const tenMinutes = 10 * 60000;

const GameTimer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isHunt = pathname === "/hunt" || pathname === "/sponsor";

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  // TODO: turn timer back on
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeRemaining(calculateTimeRemaining());

  //     if (timeRemaining <= 0) {
  //       clearInterval(interval);

  //       if (!pathname.includes("gameover") || !pathname.includes("aboutgg")) { // TODO: this doesn't work + let the about page through
  //         router.push("/gameover");
  //       }
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [timeRemaining]);

  return (
    isHunt &&
    timeRemaining < GAME_LENGTH && timeRemaining > 0 && (
      <div className={styles.main}>
        <div className={styles.container}>
          <div style={{fontSize: "44px"}}><Timer timeRemaining={timeRemaining} hideDays /></div>
          <Image src="/assets/icons/icons-24/timer.svg" alt="timer icon" width={24} height={24} />
        </div>
      </div>
    )
  );
};

export default GameTimer;
