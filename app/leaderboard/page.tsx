"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import leaderboardStats from "@/utils/leaderboard.json";

import LeaderboardItem from "@/components/leaderboard/LeaderboardItem";
import LeaderboardUser from "@/components/leaderboard/LeaderboardUser";

import styles from "./page.module.css";
import { formatDate, rand } from "@/utils";

const Page: React.FC = () => {
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    const items = leaderboardStats.map((item: any) => {
      return {
        id: item.number,
        rank: item.number,
        image: item.image,
        name: item.user,
        invitedBy: item.referrer,
        points: item.points,
      };
    });

    setItems(items);
  }, []);

  return (
    <div className={styles.main}>
      <h1>Leaderboard</h1>
      <div className={styles.mainContainer}>
        <div className={styles.leaderboard}>
          <div className={styles.leaderboardHeader}>
            <div className={styles.leaderboardHeaderLeft}>
              <div className={styles.leaderboardHeaderItem}>Rank</div>
              <div className={styles.leaderboardHeaderItem}>Name</div>
            </div>
            <div className={styles.leaderboardHeaderRight}>
              <div className={styles.leaderboardHeaderItem}>Invited by</div>
              <div className={styles.leaderboardHeaderItem}>
                <Image src="/assets/icons/icons-24/g.svg" alt="points" width={24} height={24} />
              </div>
            </div>
          </div>
          <div className={styles.leaderboardTable}>
            {/* <LeaderboardUser /> */}
            {items.map((item: any) => {
              return (
                <div className={styles.leaderboardRow} key={item.id}>
                  <LeaderboardItem item={item} />
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>Recent Joins</div>
          <div className={styles.joinContainer}></div>
          <div className={styles.invite}>
            <div className={styles.inviteHeader}>Invite friends to win</div>
            <Link href="/airdrop">
              <div className={styles.inviteButton}>Invite</div>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Page;
