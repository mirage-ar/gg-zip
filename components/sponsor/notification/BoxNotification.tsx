"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { withCommas } from "@/utils";

import styles from "./BoxNotification.module.css";
import { useApplicationContext } from "@/state/ApplicationContext";

const BoxNotification: React.FC = () => {
  const [show, setShow] = useState(false);
  const { boxNotification } = useApplicationContext();

  useEffect(() => {
    if (boxNotification) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [boxNotification]);

  const icon = "assets/icons/icons-24/box-green.svg";
  return (
    <div className={styles.main} 
    style={show ? { marginBottom: "0" } : { marginBottom: "-100px" }}
    >
      <div
        className={styles.container}
        // style={closed ? { left: "50%" } : { left: "30%" }}
      >
        <div className={styles.left}>
          <div className={styles.icon}>
            <Image src={boxNotification.player?.image || icon} alt="User Icon" width={32} height={32} />
          </div>
          <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Box Opened" width={24} height={24} />
          <p>Claimed!</p>
        </div>

        <div className={styles.right}>
          <div className={styles.points}>{withCommas(boxNotification.points)}</div>

          <Image src="/assets/icons/icons-24/g-points.svg" alt="Coin Icon" width={24} height={24} />

          <div className={styles.pin}>
            <Image src="/assets/icons/icons-24/pin.svg" alt="Pin" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxNotification;
