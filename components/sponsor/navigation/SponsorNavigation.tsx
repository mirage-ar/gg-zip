import React from "react";
import Image from "next/image";
import styles from "./SponsorNavigation.module.css";

import { Page } from "@/types";

interface SponsorNavigationProps {
  page: number;
  setPage: (page: Page) => void;
  closed: boolean;
  setClosed: (closed: boolean) => void;
}

const SponsorNavigation: React.FC<SponsorNavigationProps> = ({ page, setPage, closed, setClosed }) => {
  const handlePageChange = (page: Page) => {
    setPage(page);
    setClosed(false);
  };

  console.log(page);

  return (
    <div className={styles.main} style={closed ? { right: "50px" } : {}}>
      <div className={styles.nav}>
        <button
          className={styles.navButton}
          onClick={() => handlePageChange(Page.LEADERBOARD)}
          style={page === Page.LEADERBOARD ? { backgroundColor: "#42FF60" } : {}}
        >
          <Image
            src={`/assets/icons/icons-24/money-${page === Page.LEADERBOARD ? "black" : "white"}.svg`}
            alt="leaderboard"
            width={24}
            height={24}
          />
        </button>
        <button
          className={styles.navButton}
          onClick={() => handlePageChange(Page.TRANSACTIONS)}
          style={page === Page.TRANSACTIONS ? { backgroundColor: "#42FF60" } : {}}
        >
          <Image
            src={`/assets/icons/icons-24/transactions-${page === Page.TRANSACTIONS ? "black" : "white"}.svg`}
            alt="leaderboard"
            width={24}
            height={24}
          />
        </button>
        <button
          className={styles.navButton}
          onClick={() => handlePageChange(Page.CHAT)}
          style={page === Page.CHAT ? { backgroundColor: "#42FF60" } : {}}
        >
          <Image
            src={`/assets/icons/icons-24/chat-${page === Page.CHAT ? "black" : "white"}.svg`}
            alt="leaderboard"
            width={24}
            height={24}
          />
        </button>
        <button
          className={styles.navButton}
          onClick={() => handlePageChange(Page.POWERUPS)}
          style={page === Page.POWERUPS ? { backgroundColor: "#42FF60" } : {}}
        >
          <Image
            src={`/assets/icons/icons-24/bomb-${page === Page.POWERUPS ? "black" : "white"}.svg`}
            alt="leaderboard"
            width={24}
            height={24}
          />
        </button>

        <div className={styles.navIcon}>
          <Image src="/assets/icons/icons-24/box-green.svg" alt="koji" width={24} height={24} />
        </div>
      </div>
    </div>
  );
};

export default SponsorNavigation;
