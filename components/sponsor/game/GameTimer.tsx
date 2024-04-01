"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getNoonEasternTime } from "@/utils";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import Timer from "@/components/utility/Timer";

const fiveMintues = 5 * 60000;

const GameTimer = () => {
  const router = useRouter();

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
        router.push("/gameover");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return (
    timeRemaining <= fiveMintues && (
      <div>
        <Timer timeRemaining={timeRemaining} />
      </div>
    )
  );
};

export default GameTimer;
