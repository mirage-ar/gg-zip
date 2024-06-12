import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./TradingView.module.css";
import { Player } from "@/types";
import { formatWalletAddress, withCommas } from "@/utils";
import { useSolana } from "@/hooks";
import { useApplicationContext } from "@/state/ApplicationContext";

interface TradingViewProps {
  player: Player;
  setShowOverlay: (showOverlay: boolean) => void;
}

const TradingView: React.FC<TradingViewProps> = ({ player, setShowOverlay }) => {
  const { cardHoldings, sellPrice, buyPrice, buyPlayerCard, sellPlayerCard } = useSolana(player.wallet);
  const { transactionPending } = useApplicationContext();

  // Function to stop event propagation
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // This stops the click from propagating to the parent
  };

  const sellCard = () => {
    sellPlayerCard(1);
    setShowOverlay(false);
  };

  const buyCard = () => {
    buyPlayerCard(1);
    setShowOverlay(false);
  };

  return (
    <div className={styles.main} onClick={() => setShowOverlay(false)}>
      <div className={styles.container} onClick={handleContainerClick}>
        {/* PLAYER USERNAME */}
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfo}>
            <Image className={styles.userImage} src={player.image} alt="user" width={50} height={50} />
            <div className={styles.userName}>
              <span>@{player.username}</span>
              <span style={{ color: "#373737" }}>{formatWalletAddress(player.wallet || "")}</span>
            </div>
          </div>

          <div className={styles.userInfo} style={{ gap: "6px" }}>
            <div className={styles.points}>{withCommas(player.points)}</div>
            <Image src="/assets/icons/icons-24/g.svg" alt="Points" width={32} height={32} />
          </div>
        </div>

        <div className={styles.spacer} />

        {/* PLAYER INFO */}
        <div className={styles.subInfoContainer}>
          <div className={styles.titleRow}>
            <p>Character</p>
            <p>Rank</p>
            <p>Boxes</p>
            <p>Twitter</p>
          </div>
          <div className={styles.contentRow}>
            <p>Hunter</p>
            <p>{player.rank || 0}</p>
            <p>{player.boxes}</p>
            <p>
              <Link href={`https://twitter.com/${player.username}`}>@{player.username}</Link>
            </p>
          </div>
        </div>

        <div className={styles.spacer} />

        {/* PLAYER CARD STATUS */}
        <div className={styles.subInfoContainer}>
          <div className={styles.titleRow}>Status</div>
          <div className={styles.contentRow}>You hold {cardHoldings} cards</div>
        </div>

        <div className={styles.spacer} />

        {/* TRADING BUTTONS */}
        <div className={styles.buttonContainer}>
          <button className={styles.sellButton} disabled={cardHoldings < 1} onClick={sellCard}>
            <p>Sell</p>
            <span>{sellPrice.toFixed(3)}</span>
          </button>
          <button className={styles.buyButton} onClick={buyCard}>
            <p>Buy</p>
            <span>{buyPrice.toFixed(3)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingView;
