"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getNoonEasternTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import Timer from "@/components/utility/Timer";

import styles from "./GameTimer.module.css";

const tenMinutes = 10 * 60000;

const GameTimer = () => {
  const router = useRouter();
  const pathname = usePathname()

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getNoonEasternTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);

        if (!pathname.includes("gameover")) {
          router.push("/gameover");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return (
    timeRemaining <= tenMinutes && timeRemaining > 0 && (
      <div className={styles.main}>
        <div className={styles.container}>
          <p>The hunt will finish in</p>
          <Timer timeRemaining={timeRemaining} hideDays />
        </div>
      </div>
    )
  );
};

export default GameTimer;
