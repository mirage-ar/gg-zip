import React from "react";
import Image from "next/image";

import styles from "./LeaderboardItem.module.css";

import { LeaderboardItem } from "@/types";
import { formatPoints } from "@/utils";

interface LeaderboardItemProps {
  item: LeaderboardItem;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item }) => {
  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <div className={styles.rank}>{item.rank}</div>
        <div className={styles.name}>
          <Image src={item.image} alt="user image" width={32} height={32} />
          {item.name}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.invitedBy}>
        {item.invitedBy}
          </div>
        <div className={styles.points}>{formatPoints(item.points)}</div>
      </div>
    </div>
  );
};

export default LeaderboardItem;
