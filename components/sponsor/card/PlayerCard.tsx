import React from "react";
import Image from "next/image";
import styles from "./PlayerCard.module.css";
import { useUser } from "@/hooks";
import { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  // This function is used to calculate the color of the card based on the holding amount
  const calculateCardColor = (holdingAmount: number) => {
    if (holdingAmount > 25) {
      return `card-25`;
    } else if (holdingAmount > 20) {
      return `card-20`;
    } else if (holdingAmount > 15) {
      return `card-15`;
    } else if (holdingAmount > 10) {
      return `card-10`;
    } else if (holdingAmount > 5) {
      return `card-5`;
    } else if (holdingAmount > 0) {
      return `card-1`;
    } else {
      return "card-0";
    }
  };

  return (
    <div className={styles.playerCard}>
      <Image className={styles.playerCardUser} src={player.image} alt={"player card"} width={250} height={300} />
      <Image
        className={styles.playerCardImage}
        src={`/assets/cards/${calculateCardColor(player.holdingAmount || 0)}.png`}
        alt={"player card"}
        width={250}
        height={300}
      />
    </div>
  );
};

export default PlayerCard;
