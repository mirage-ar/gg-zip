"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Timer from "@/components/utility/Timer";
import Calendar from "@/components/utility/Calendar";

import styles from "./GameTimer.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import { useApplicationContext } from "@/state/ApplicationContext";

const fiveMinutes = 5 * 60000;
const ONE_HOUR = 60 * 60000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const GameTimer = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const pathname = usePathname();

  const { closed, setGameEnding, setGameOver } = useApplicationContext();

  const isHunt = pathname === "/hunt" || pathname === "/";

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
        setGameOver(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, pathname]);

  if (timeRemaining > 0) {
    return (
      isHunt && (
        <>
          {showCalendar && <Calendar setShowCalendar={setShowCalendar} />}
          <div className={styles.main} style={closed ? { width: "100%" } : { width: "80%" }}>
            {timeRemaining > GAME_LENGTH && <div className={styles.title}>The hunt will start in</div>}
            <div className={styles.container}>
              <div style={{ fontSize: "32px" }}>
                <Timer
                  timeRemaining={timeRemaining < GAME_LENGTH ? timeRemaining : timeRemaining - GAME_LENGTH}
                  hideDays={hideDays}
                />
              </div>
              {/* <Image
                src={`/assets/icons/icons-24/timer${timeRemaining > GAME_LENGTH ? "-pink" : ""}.svg`}
                alt="timer icon"
                width={24}
                height={24}
              />
              <Image src={`/assets/icons/spacer-22.svg`} alt="spacer" width={2} height={22} />
              <Image
                src={`/assets/icons/icons-24/calendar.svg`}
                alt="calendar icon"
                width={24}
                height={24}
                onClick={() => setShowCalendar(true)}
                style={{ cursor: "pointer" }}
              /> */}
            </div>
          </div>
        </>
      )
    );
  } else {
    return (
      isHunt && (
        <div className={styles.main} style={closed ? { width: "100%" } : { width: "80%" }}>
          <div className={styles.container}>
            <div className={styles.gameOver} style={{ fontSize: "32px" }}>
              GAME OVER
            </div>
            <Image
              src={`/assets/icons/icons-24/timer${timeRemaining > GAME_LENGTH ? "-pink" : ""}.svg`}
              alt="timer icon"
              width={24}
              height={24}
            />
          </div>
        </div>
      )
    );
  }
};

export default GameTimer;
