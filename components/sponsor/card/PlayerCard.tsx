import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PlayerCard.module.css";
import { useSolana } from "@/hooks";
import { Player, SponsorHoldings } from "@/types";
import { useApplicationContext } from "@/state/ApplicationContext";

interface PlayerCardProps {
  player: Player;
  sponsorHoldings?: SponsorHoldings[];
  showButtons?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, sponsorHoldings, showButtons }) => {
  const { cardHoldings, sellPrice, buyPrice, buyPlayerCard, sellPlayerCard } = useSolana(player.wallet);
  const { transactionDetails } = useApplicationContext();

  const [holdingAmountCard, setHoldingAmountCard] = useState<string>("card-0");
  const [amount, setAmount] = useState(1);

  const [showRankInfo, setShowRankInfo] = useState(false);
  const [showAmountInfo, setShowAmountInfo] = useState(false);

  const holdingAmount = player.amount || sponsorHoldings?.find((user) => user.wallet === player.wallet)?.amount;

  // This function is used to calculate the color of the card based on the holding amount
  const calculateCardColor = (holdingAmount: number) => {
    if (holdingAmount > 25) {
      return `card-25`;
    } else if (holdingAmount >= 20) {
      return `card-20`;
    } else if (holdingAmount >= 15) {
      return `card-15`;
    } else if (holdingAmount >= 10) {
      return `card-10`;
    } else if (holdingAmount >= 5) {
      return `card-5`;
    } else if (holdingAmount > 0) {
      return `card-1`;
    } else {
      return "card-0";
    }
  };

  useEffect(() => {
    if (!transactionDetails?.pending) {
      setAmount(1);
    }
  }, [transactionDetails]);

  useEffect(() => {
    setHoldingAmountCard(
      calculateCardColor(player.amount || sponsorHoldings?.find((user) => user.wallet === player.wallet)?.amount || 0)
    );
  }, [sponsorHoldings, player]);

  const buyCard = () => {
    buyPlayerCard(amount);
  };

  const sellCard = () => {
    sellPlayerCard(amount);
  };

  return (
    <div className={styles.main}>
      <div className={styles.playerCard}>
        <Image className={styles.playerCardUser} src={player.image} alt={"player card"} width={250} height={300} />
        <Image
          className={styles.playerCardImage}
          src={`/assets/cards/${holdingAmountCard}.png`}
          alt={"player card"}
          width={250}
          height={300}
        />
        <div className={styles.playerCardPoints}>
          {player.points}
          <Image src="/assets/icons/icons-16/points.svg" alt="points" width={16} height={16} />
        </div>

        <div
          className={styles.playerCardRank}
          onMouseEnter={() => setShowRankInfo(true)}
          onMouseLeave={() => setShowRankInfo(false)}
        >
          {player.rank}
        </div>
        <div className={`${styles.playerCardRankInfo} ${showRankInfo ? styles.show : {}}`}>Player Rank</div>

        <div className={styles.playerCardAmountContainer}
                  onMouseEnter={() => setShowAmountInfo(true)}
                  onMouseLeave={() => setShowAmountInfo(false)}
        >
          <Image src="/assets/graphics/ball-white.svg" alt="sphere" width={30} height={30} />
          {holdingAmount && (
            <>
              <Image src="/assets/graphics/bar-spacer.svg" alt="spacer" width={35} height={2} />
              <div className={styles.playerCardAmount}>
                {holdingAmount}
                <Image src="/assets/icons/icons-16/card.svg" alt="holding amount" width={16} height={16} />
              </div>
              <div className={`${styles.playerCardAmountInfo} ${showAmountInfo ? styles.show : {}}`}>Cards Held</div>
            </>
          )}
        </div>
      </div>

      {showButtons && (
        <>
          <div className={styles.playerName}>
            <Link href={`https://twitter.com/${player.username}`} target="new">
              @{player.username}
            </Link>
          </div>
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
          <div className={styles.playerCardButtons}>
            <button className={styles.buyButton} onClick={buyCard} disabled={transactionDetails?.pending}>
              <p>Buy</p>
              <span>{buyPrice.toFixed(3)}</span>
            </button>
            <button className={styles.sellButton} disabled={cardHoldings < 1 || amount > cardHoldings || transactionDetails?.pending} onClick={sellCard}>
              <p>Sell</p>
              <span>{sellPrice.toFixed(3)}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerCard;
