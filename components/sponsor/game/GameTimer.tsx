"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Timer from "@/components/utility/Timer";

import styles from "./GameTimer.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import { useApplicationContext } from "@/state/ApplicationContext";

const tenMinutes = 10 * 60000;

const GameTimer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { closed, setClosed } = useApplicationContext();

  const isHunt = pathname === "/hunt" || pathname === "/sponsor";

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);

        // TODO: new game over screen
        // if (pathname === "/sponsor") {
        //   router.push("/gameover");
        // }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, pathname]);

  return (
    isHunt &&
    timeRemaining < GAME_LENGTH &&
    timeRemaining > 0 && (
      <div className={styles.main} style={closed ? { width: "100%" } : { width: "70%" }}>
        <div className={styles.container}>
          <div style={{ fontSize: "44px" }}>
            <Timer timeRemaining={timeRemaining} />
          </div>
          <Image src="/assets/icons/icons-24/timer.svg" alt="timer icon" width={24} height={24} />
        </div>
      </div>
    )
  );
};

export default GameTimer;
