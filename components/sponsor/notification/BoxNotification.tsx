"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { withCommas } from "@/utils";

import styles from "./BoxNotification.module.css";
import { User } from "@/types";

const BoxNotification: React.FC = () => {
  const boxId = useRef<string>("0");
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);

  const fetchLatestBox = async () => {
    const res = await fetch(`/api/notification/${boxId.current}`);
    const data = await res.json();

    if (data.success !== false) {
      setShow(true);
      boxId.current = data.id;
      setPoints(data.points);
      setUser(data.collector);
    }
  };

  useEffect(() => {
    const getBoxNotification = setInterval(() => {
      fetchLatestBox();
    }, 1000);

    return () => {
      clearInterval(getBoxNotification);
    };
  }, []);

  const icon = "assets/icons/icons-24/box-opened-green.svg";
  return (
    show && (
      <>
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.icon}>
              <Image src={user?.image || icon} alt="User Icon" width={32} height={32} />
            </div>
            <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Box Opened" width={24} height={24} />
            <p>Claimed!</p>
          </div>

          <div className={styles.right}>
            <div className={styles.points}>{withCommas(points)}</div>

            <Image src="/assets/icons/icons-24/g-points.svg" alt="Coin Icon" width={24} height={24} />

            <div className={styles.pin}>
              <Image src="/assets/icons/icons-24/pin.svg" alt="Pin" width={24} height={24} />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default BoxNotification;
