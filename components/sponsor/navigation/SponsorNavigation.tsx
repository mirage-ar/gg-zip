import React from "react";
import Image from "next/image";
import styles from "./SponsorNavigation.module.css";

import { Page } from "@/types";
import { useApplicationContext } from "@/state/ApplicationContext";

interface SponsorNavigationProps {
  page: number;
  setPage: (page: Page) => void;
  closed: boolean;
  setClosed: (closed: boolean) => void;
}

const SponsorNavigation: React.FC<SponsorNavigationProps> = ({ page, setPage, closed, setClosed }) => {
  const { globalUser: user, setShowOnboarding } = useApplicationContext();

  const handlePageChange = (page: Page) => {
    if (!user) {
      setShowOnboarding(true);
    } else {
      setPage(page);
      setClosed(false);
    }
  };

  return (
    <div className={styles.main} style={closed ? { right: "50px" } : {}}>
      <div className={styles.nav} style={page === Page.PROFILE ? { backgroundColor: "#42FF60" } : {}}>
        {/* LEADERBOARD BUTTON */}
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

        {/* SPONSORS BUTTON */}
        {/* <button
          className={styles.navButton}
          onClick={() => handlePageChange(Page.SPONSORS)}
          style={page === Page.SPONSORS ? { backgroundColor: "#42FF60" } : {}}
        >
          <Image
            src={`/assets/icons/icons-24/sponsors-${page === Page.SPONSORS ? "black" : "white"}.svg`}
            alt="leaderboard"
            width={24}
            height={24}
          />
        </button> */}

        {/* TRANSACTIONS BUTTON */}
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

        {/* POWERUPS BUTTON */}
        {/* <button
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
        </button> */}

        {/* PROFILE BUTTON */}
        <div
          className={styles.navIcon}
          onClick={() => handlePageChange(Page.PROFILE)}
          style={page === Page.PROFILE ? { backgroundColor: "#42FF60" } : {}}
        >
          {user ? (
            <Image
              src={user?.image || ""}
              className={styles.userIcon}
              style={page === Page.PROFILE ? { border: "1px solid #000" } : {}}
              alt="koji"
              width={60}
              height={60}
            />
          ) : (
            <Image
              src={`/assets/icons/icons-24/box-${page === Page.PROFILE ? "black" : "green"}.svg`}
              alt="koji"
              width={24}
              height={24}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorNavigation;
