"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./UserInfo.module.css";

import { formatWalletAddress, formatPoints } from "@/utils";
import { useUser } from "@/hooks";
import { Player } from "@/types";

interface UserInfoProps {
  closed?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ closed }) => {
  const [user, setUser] = useState<Player | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  const { publicKey, connectWallet } = useUser();

  useEffect(() => {
    if (!publicKey) return;

    const getUserPoints = async () => {
      const res = await fetch(`/api/points/${publicKey.toBase58()}`);
      const data = await res.json();
      if (data.points) {
        setPoints(data.points);
      }
    };

    getUserPoints();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className={styles.main} style={closed ? { marginRight: "70px" } : {}}>
        <button className={styles.connectWallet} onClick={connectWallet}>
          Connect Wallet
        </button>
        <div className={styles.userPointsContainer}>
          <div className={styles.placeholder}>000000</div>
          <Image src="/assets/icons/icons-24/g.svg" alt="points icon" width={24} height={24} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main} style={closed ? { marginRight: "70px" } : {}}>
      <div className={styles.userDetails}>
        {/* --- WALLET ADDRESS --- */}
        {publicKey ? (
          <div>{formatWalletAddress(publicKey.toBase58())}</div>
        ) : (
          <div className={styles.placeholder}>____</div>
        )}

        {/* --- USERNAME --- */}
        {user?.username && (
          <>
            <span className={styles.spacer}>•</span>
            <div>@{user.username}</div>
          </>
        )}

        {/* --- USER IMAGE --- */}
        {!publicKey && !user?.username && <div className={styles.userIconPlaceholder} />}
        {publicKey && !user?.image && (
          <div className={styles.userWalletIcon}>
            <Image src="/assets/icons/profile-user.svg" alt="user icon" width={24} height={24} />
          </div>
        )}
        {user?.image && (
          <div className={styles.userIcon}>
            <Image src={user.image} alt="user icon" width={32} height={32} />
          </div>
        )}

        {/* --- USER POINTS --- */}
      </div>
      <div className={styles.userPointsContainer}>
        {points ? (
          <div className={styles.userPoints}>{formatPoints(points)}</div>
        ) : (
          <div className={styles.placeholder}>000000</div>
        )}
        <Image src="/assets/icons/icons-24/g.svg" alt="points icon" width={24} height={24} />
      </div>
    </div>
  );
};

export default UserInfo;
