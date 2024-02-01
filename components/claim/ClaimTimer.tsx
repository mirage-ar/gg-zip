"use client";

import React, { useState, useEffect } from "react";
import { formatTime } from "@/utils";

import styles from "./ClaimTimer.module.css";

const ClaimTimer: React.FC = () => {
  // const [time, setTime] = useState<string | null>(null); // 24 hours in seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // 24 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      const previousTime = parseInt(localStorage.getItem("time") ?? "86401");
      const newTime = previousTime - 1;
      setTimeRemaining(newTime);
      // store time in local storage
      localStorage.setItem("time", newTime.toString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.main}>
      <div>{formatTime(timeRemaining)}</div>
    </div>
  );
};

export default ClaimTimer;
