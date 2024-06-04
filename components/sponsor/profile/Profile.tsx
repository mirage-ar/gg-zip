import React, { useEffect, useState } from "react";
import PlayerCard from "@/components/sponsor/card/PlayerCard";

import styles from "./Profile.module.css";
import { Player, SponsorHoldings } from "@/types";

interface ProfileProps {
  playerList: Player[];
  sponsorHoldings: SponsorHoldings[];
}

const Profile: React.FC<ProfileProps> = ({ playerList, sponsorHoldings }) => {
  const [playerCards, setPlayerCards] = useState<Player[]>([]);

  useEffect(() => {
    let playerCards = [];
    for (let i = 0; i < sponsorHoldings.length; i++) {
      const player = playerList.find((player) => player.wallet === sponsorHoldings[i].wallet);
      if (player) {
        player.holdingAmount = sponsorHoldings[i].amount;
        playerCards.push(player);
      }
    }

    setPlayerCards(playerCards);
  }, [playerList]);

  return (
    <div className={styles.main}>
      <div className={styles.playerCards}>
        {playerCards.map((player) => (
          <PlayerCard key={player.wallet} player={player} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
