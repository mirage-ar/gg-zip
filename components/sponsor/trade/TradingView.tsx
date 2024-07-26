import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./TradingView.module.css";
import { Player, TransactionType } from "@/types";
import { formatWalletAddress, withCommas } from "@/utils";
import { useSolana } from "@/hooks";
import { useApplicationContext } from "@/state/ApplicationContext";
import PlayerCard from "../card/PlayerCard";

interface TradingViewProps {
  player: Player;
  setShowOverlay: (showOverlay: boolean) => void;
}

const TradingView: React.FC<TradingViewProps> = ({ player, setShowOverlay }) => {
  const [amount, setAmount] = useState(1);
  const [playerWithAmount, setPlayerWithAmount] = useState<Player>(player);
  const { cardHoldings, sellPrice, buyPrice, buyPlayerCard, sellPlayerCard } = useSolana(player.wallet);

  const { transactionDetails, setTransactionDetails } = useApplicationContext();

  const [transactionStarted, setTransactionStarted] = useState(false);

  // Reset transaction details on mount
  useEffect(() => {
    setTransactionDetails(null);
  }, []);

  // Function to stop event propagation
  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // This stops the click from propagating to the parent
  };

  const sellCard = () => {
    sellPlayerCard(amount);
    setTransactionStarted(true);
  };

  const buyCard = () => {
    buyPlayerCard(amount);
    setTransactionStarted(true);
  };

  useEffect(() => {
    setPlayerWithAmount({ ...player, amount: cardHoldings });
  }, [player, cardHoldings]);

  // CURRENTLY CLOSES VIEW AFTER TX FINISHED
  useEffect(() => {
    if (transactionStarted && !transactionDetails?.pending && !transactionDetails?.error) {
      setShowOverlay(false);
    }
  }, [transactionDetails]);

  const buyButtonConent = () => {
    if (transactionDetails?.error && transactionDetails.type === TransactionType.BUY) {
      return (
        <button className={styles.buyButton} style={{ backgroundColor: "#FF3D00" }}>
          <div className={styles.buttonTextContainer}>Error</div>
        </button>
      );
    }

    if (transactionDetails?.pending && transactionDetails.type === TransactionType.BUY) {
      return (
        <button className={styles.buyButton}>
          <div className={styles.buttonTextContainer}>
            <Image src="/assets/graphics/transaction.gif" alt="Buy" width={32} height={22} />
          </div>
        </button>
      );
    }

    return (
      <>
        <button className={styles.buyButton} onClick={buyCard} disabled={transactionDetails?.pending || transactionDetails?.error}>
          <p>Buy</p>
          <span>{(buyPrice * amount).toFixed(3)}</span>
        </button>
      </>
    );
  };

  const sellButtonContent = () => {
    if (transactionDetails?.error && transactionDetails.type === TransactionType.SELL) {
      return (
        <button className={styles.sellButton} style={{ backgroundColor: "#FF3D00", color: "#000" }}>
          <div className={styles.buttonTextContainer}>Error</div>
        </button>
      );
    }

    if (transactionDetails?.pending && transactionDetails.type === TransactionType.SELL) {
      return (
        <button className={styles.sellButton}>
          <div className={styles.buttonTextContainer}>
            <Image src="/assets/graphics/transaction-white.gif" alt="Sell" width={32} height={22} />
          </div>
        </button>
      );
    }

    return (
      <button
        className={styles.sellButton}
        disabled={cardHoldings < 1 || amount > cardHoldings || transactionDetails?.pending || transactionDetails?.error}
        onClick={sellCard}
      >
        <p>Sell</p>
        <span>{(sellPrice * amount).toFixed(3)}</span>
      </button>
    );
  };

  return (
    <div className={styles.main} onClick={() => setShowOverlay(false)}>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.header}>Trade</div>
        <PlayerCard player={playerWithAmount} />
        <div className={styles.playerName}>
          <Link href={`https://twitter.com/${player.username}`} target="new">
            @{player.username}
          </Link>
        </div>
        <div className={styles.spacer} />

        {/* PLAYER INFO */}
        <div className={styles.subInfoContainer}>
          <div className={styles.titleRow}>
            <p>Rank</p>
            <p>Boxes</p>
            <p>Points</p>
          </div>
          <div className={styles.contentRow}>
            <div className={styles.contentInfo}>
              {player.rank || 0}
              <Image src="/assets/icons/icons-16/rank.svg" alt="Rank" width={16} height={16} />
            </div>
            <div className={styles.contentInfo}>
              {player.boxes}
              <Image src="/assets/icons/icons-16/box-opened-green.svg" alt="Rank" width={16} height={16} />
            </div>
            <div className={styles.contentInfo}>
              {withCommas(player.points)}
              <Image src="/assets/icons/icons-16/points.svg" alt="Rank" width={16} height={16} />
            </div>
          </div>
        </div>
        <div className={styles.spacer} />

        {/* TRADING AMOUNT */}
        <div className={styles.amountContainer}>
          <div className={styles.amountButton}>
            <Image
              src="/assets/icons/icons-16/minus.svg"
              alt="Minus"
              width={16}
              height={16}
              onClick={() => setAmount(amount - 1 === 0 ? 1 : amount - 1)}
            />
          </div>
          <div className={styles.amount}>
            <p>{amount}</p>
            <Image src="/assets/icons/icons-16/card.svg" alt="Card" width={16} height={16} />
          </div>
          <div className={styles.amountButton}>
            <Image
              src="/assets/icons/icons-16/plus.svg"
              alt="Plus"
              width={16}
              height={16}
              onClick={() => setAmount(amount + 1)}
            />
          </div>
        </div>

        {/* TRADING BUTTONS */}
        <div className={styles.buttonContainer}>
          {buyButtonConent()}
          {sellButtonContent()}
          <div className={styles.errorMessage}>
            {transactionDetails?.error && <p>{transactionDetails?.errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;
