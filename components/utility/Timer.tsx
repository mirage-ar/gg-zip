"use client";

import { useEffect, useState } from 'react';

import styles from './Timer.module.css';

interface TimerProps {
    date: Date;
}

const Timer: React.FC<TimerProps> = ({ date }) => {
    // Calculate initial time remaining immediately
    const calculateTimeRemaining = () => {
        const currentTime = new Date().getTime();
        const targetTime = date.getTime();
        return targetTime - currentTime;
    };

    const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = calculateTimeRemaining();

            setTimeRemaining(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    const formatTime = (time: number): string => {
        if (time <= 0) {
            return "00:00:00";
        }
        const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
        const minutes = Math.floor((time / 1000 / 60) % 60).toString().padStart(2, '0');
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
        const days = Math.floor(time / (1000 * 60 * 60 * 24)).toString();

        return `${days}:${hours}:${minutes}:${seconds}`;
    };

    return <div className={styles.main}>{formatTime(timeRemaining)}</div>;
};

export default Timer;