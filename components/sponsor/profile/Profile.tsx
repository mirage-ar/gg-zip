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

  // SO WE DON'T HAVE TO FETCH IN DB EVERY POLLING TIME
  const [heldPlayerCards, setHeldPlayerCards] = useState<Player[]>([]);

  const { setShowOnboarding } = useApplicationContext();

  const getPlayer = async (wallet: string): Promise<Player | null> => {
    try {
      const response = await fetch(`api/user/${wallet}`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching player:", error);
      return null;
    }
  };

  useEffect(() => {
    const getPlayerCards = async () => {
      let playerCards = [];
      for (let i = 0; i < sponsorHoldings.length; i++) {
        const playerListContainsPlayer = playerList.some((player) => player.wallet === sponsorHoldings[i].wallet);
        if (playerListContainsPlayer) {
          const player = playerList.find((player) => player.wallet === sponsorHoldings[i].wallet);
          if (player) {
            const playerRank = playerList.indexOf(player) + 1;
            player.amount = sponsorHoldings[i].amount;
            player.rank = playerRank;
            playerCards.push(player);
          }
        }
      }

      const sortedPlayerCards = playerCards.sort((a, b) => (a.rank || 0) - (b.rank || 0));
      setPlayerCards(sortedPlayerCards);
    };

    getPlayerCards();
  }, [sponsorHoldings, playerList]);

  useEffect(() => {
    const getHeldPlayerCards = async () => {
      let playerCards = [];
      for (let i = 0; i < sponsorHoldings.length; i++) {
        const playerListContainsPlayer = playerList.some((player) => player.wallet === sponsorHoldings[i].wallet);
        if (!playerListContainsPlayer) {
          const player = await getPlayer(sponsorHoldings[i].wallet);
          if (player) {
            player.amount = sponsorHoldings[i].amount;
            playerCards.push(player);
          }
        }
      }
      setHeldPlayerCards(playerCards);
    };

    getHeldPlayerCards();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.main}>
      <button className={styles.editProfile} onClick={() => setShowOnboarding(true)}>
        Edit Profile
        <Image src="/assets/icons/icons-24/settings.svg" alt="settings" width={24} height={24} />
      </button>
      <div className={styles.title}>Cards</div>
      <div className={styles.scrollable}>
        <div className={styles.playerCards}>
          {playerCards.concat(heldPlayerCards).map((player) => (
            <PlayerCard key={player.wallet} player={player} sponsorHoldings={sponsorHoldings} showButtons />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
