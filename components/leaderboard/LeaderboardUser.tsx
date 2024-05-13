"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";

import styles from "./LeaderboardUser.module.css";
import { Player } from "@/types";
import { formatPoints } from "@/utils";

const LeaderboardUser: React.FC = () => {
  const [user, setUser] = useState<Player | null>(null);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  // USE USE USER HOOK
  // useEffect(() => {
  //   if (!publicKey) return;

  //   const fetchUser = async () => {
  //     const res = await fetch(`/api/points/${publicKey?.toBase58()}`);
  //     const data = await res.json();
  //     if (data.id) {
  //       setUser(data);
  //       setReferrer(data.Referrer[0]?.referrer.name);
  //     }
  //   };

  //   fetchUser();
  // }, [publicKey]);

  return (
    user && (
      <div className={styles.main}>
        <div className={styles.left}>
          {/* <div className={styles.rank}>{formatPoints(rank || 0)}</div> */}
          <div className={styles.name}>
            <Image src={user?.image || "/assets/icons/profile-user.svg"} alt="user image" width={32} height={32} />
            {user?.username}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.invitedBy}>{referrer}</div>
          <div className={styles.points}>{formatPoints(user?.points || 0)}</div>
        </div>
      </div>
    )
  );
};

export default LeaderboardUser;
