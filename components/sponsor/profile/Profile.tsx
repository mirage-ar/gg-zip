import React, { useEffect, useState } from "react";
import Image from "next/image";
import PlayerCard from "@/components/sponsor/card/PlayerCard";

import styles from "./Profile.module.css";
import { Player, SponsorHoldings } from "@/types";
import { useApplicationContext } from "@/state/ApplicationContext";

interface ProfileProps {
  playerList: Player[];
  sponsorHoldings: SponsorHoldings[];
}

const Profile: React.FC<ProfileProps> = ({ playerList, sponsorHoldings }) => {
  const [playerCards, setPlayerCards] = useState<Player[]>([]);

  const { showOnboarding, setShowOnboarding } = useApplicationContext();

  useEffect(() => {
    let playerCards = [];
    for (let i = 0; i < playerList.length; i++) {
      const player = playerList[i];
      player.amount = sponsorHoldings.find((user) => user.wallet === player.wallet)?.amount || 0;
      player.rank = i + 1;
      const playerIsHeld = sponsorHoldings.find((user) => user.wallet === player.wallet);
      if (playerIsHeld) {
        playerCards.push(player);
      }
    }

    const sortedPlayerCards = playerCards.sort((a, b) => (a.rank || 0) - (b.rank || 0));

    setPlayerCards(sortedPlayerCards);
  }, [playerList, sponsorHoldings]);

  return (
    <div className={styles.main}>
      <button className={styles.editProfile} onClick={() => setShowOnboarding(true)}>
        Edit Profile
        <Image src="/assets/icons/icons-24/settings.svg" alt="settings" width={24} height={24} />
      </button>
      <div className={styles.title}>Cards</div>
      <div className={styles.scrollable}>
        <div className={styles.playerCards}>
          {playerCards.map((player) => (
            <PlayerCard key={player.wallet} player={player} sponsorHoldings={sponsorHoldings} showButtons />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
