"use client";

import React from "react";
import Image from "next/image";

import styles from "./UserInfo.module.css";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { useApplicationContext } from "@/state/ApplicationContext";
import { formatWalletAddress, formatPoints } from "@/utils";
import { Page } from "@/types";

const UserInfo: React.FC = () => {

  const { globalUser: user, closed, setPage } = useApplicationContext();


  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <div className={styles.main} style={closed ? { marginRight: "70px" } : {}}>
        <button className={styles.connectWallet} onClick={() => setVisible(true)}>
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
      <div className={styles.userDetails} onClick={() => setPage(Page.PROFILE)}>
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
            <div>{user.username}</div>
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
        {user?.points ? (
          <div className={styles.userPoints}>{formatPoints(user.points)}</div>
        ) : (
          <div className={styles.placeholder}>000000</div>
        )}
        <Image src="/assets/icons/icons-24/g.svg" alt="points icon" width={24} height={24} />
      </div>
    </div>
  );
};

export default UserInfo;
