"use client";

import { useEffect, useState } from "react";

import styles from "./Timer.module.css";

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
//   // Calc noon eastern time
//   function getNoonEasternTime(year: number, month: number, day: number) {
//     const zeroIndexMonth = month - 1;
//     // Create a date object for 12:00 in Eastern Time (UTC-5 or UTC-4)
//     const easternTime = new Date(Date.UTC(year, zeroIndexMonth, day, 17, 0, 0)); // Initially assuming EST (UTC-5)
//     return easternTime.getTime(); // Use .getTime() for compatibility
//   }

//   // Calculate initial time remaining immediately
//   const calculateTimeRemaining = () => {
//     const currentTime = new Date().getTime();
//     const targetTime = getNoonEasternTime(2024, 3, 30); // Month is 0-indexed, 3 = April
//     return targetTime - currentTime;
//   };

//   const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeRemaining(calculateTimeRemaining());

//       if (timeRemaining <= 0) {
//         clearInterval(interval);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeRemaining]);

  const formatTime = (time: number): string => {
    if (time <= 0) {
      return "00:00:00:00"; // Added days to the format
    }
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, "0");
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time / 1000) % 60)
      .toString()
      .padStart(2, "0");

    return `${days}:${hours}:${minutes}:${seconds}`; // Now includes days
  };

  return <div className={styles.main}>{formatTime(timeRemaining)}</div>;
};

export default Timer;
