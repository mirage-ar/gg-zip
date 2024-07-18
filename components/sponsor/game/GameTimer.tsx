"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Timer from "@/components/utility/Timer";

import styles from "./GameTimer.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import { useApplicationContext } from "@/state/ApplicationContext";

const fiveMinutes = 5 * 60000;
const ONE_HOUR = 60 * 60000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const GameTimer = () => {
  const pathname = usePathname();

  const { closed, setGameEnding } = useApplicationContext();

  const isHunt = pathname === "/hunt" || pathname === "/sponsor";

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());
  const hideDays = timeRemaining < ONE_DAY;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= fiveMinutes) {
        setGameEnding(true);
      }

      if (timeRemaining <= 0) {
        setGameEnding(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, pathname]);

  return (
    isHunt &&
    timeRemaining > 0 && (
      <div className={styles.main} style={closed ? { width: "100%" } : { width: "80%" }}>
        {timeRemaining > GAME_LENGTH && <div className={styles.title}>The hunt will start in</div>}
        <div className={styles.container}>
          <div style={{ fontSize: "32px" }}>
            <Timer timeRemaining={timeRemaining < GAME_LENGTH ? timeRemaining : timeRemaining - GAME_LENGTH} hideDays={hideDays} />
          </div>
          <Image src={`/assets/icons/icons-24/timer${timeRemaining > GAME_LENGTH ? "-pink" : ""}.svg`} alt="timer icon" width={24} height={24} />
        </div>
      </div>
    )
  );
};

export default GameTimer;
