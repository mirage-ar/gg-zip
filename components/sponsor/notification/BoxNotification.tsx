import React from "react";
import Image from "next/image";

import { withCommas } from "@/utils";

import styles from "./BoxNotification.module.css";

const BoxNotification: React.FC = () => {
  const icon = "assets/icons/icons-24/box-opened-green.svg";
  const points = 1000;
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.icon}>
          <Image src={icon} alt="User Icon" width={32} height={32} />
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
  );
};

export default BoxNotification;
