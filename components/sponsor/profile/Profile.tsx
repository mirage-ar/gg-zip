import React, { useEffect, useState } from "react";
import Image from "next/image";
import PlayerCard from "@/components/sponsor/card/PlayerCard";
import Transactions from "@/components/sponsor/transactions/Transactions";

import styles from "./Profile.module.css";
import { Player, SponsorHoldings } from "@/types";
import { useApplicationContext } from "@/state/ApplicationContext";
import { formatWalletAddress } from "@/utils";
import { useSolana } from "@/hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { lamportsToSol } from "@/solana";

enum ProfileTab {
  SPONSOR = "SPONSOR",
  HUNTER = "HUNTER",
}

interface ProfileProps {
  playerList: Player[];
  sponsorHoldings: SponsorHoldings[];
}

const Profile: React.FC<ProfileProps> = ({ playerList, sponsorHoldings }) => {
  const [playerCards, setPlayerCards] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.SPONSOR);
  const [hunter, setHunter] = useState<Player | null>(null);
  const [mintAccount, setMintAccount] = useState<any | null>(null);

  const { publicKey } = useWallet();
  const { getPlayerMintAccount, withdrawFromMint } = useSolana();
  const { transactionPending } = useApplicationContext();

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
    if (!publicKey) return;
    if (transactionPending) return;
    const fetchMintAccount = async () => {
      const mintAccount = await getPlayerMintAccount(publicKey.toBase58());
      setMintAccount(mintAccount);

      if (mintAccount) {
        const player = await getPlayer(publicKey.toBase58());
        setHunter(player);
      }
    };

    fetchMintAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, transactionPending]);

  // TODO: clean this up
  // LIVE HELD CARDS
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

  // HELD CARDS IN PRISMA DB
  useEffect(() => {
    const getHeldPlayerCards = async () => {
      let playerCards = [];
      for (let i = 0; i < sponsorHoldings.length; i++) {
        const playerListContainsPlayer = playerList.some((player) => player.wallet === sponsorHoldings[i].wallet);
        if (!playerListContainsPlayer) {
          const playerExists = heldPlayerCards.find((player) => player.wallet === sponsorHoldings[i].wallet);
          if (!playerExists) {
            const player = await getPlayer(sponsorHoldings[i].wallet);
            if (player) {
              player.amount = sponsorHoldings[i].amount;
              playerCards.push(player);
            }
          } else {
            playerExists.amount = sponsorHoldings[i].amount;
            playerCards.push(playerExists);
          }
        }
      }

      setHeldPlayerCards(playerCards);
    };

    getHeldPlayerCards();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsorHoldings]);

  return (
    <div className={styles.main}>
      <button className={styles.editProfile} onClick={() => setShowOnboarding(true)}>
        Edit Profile
        <Image src="/assets/icons/icons-24/settings.svg" alt="settings" width={24} height={24} />
      </button>
      {/* TODO: update to see if user has a mint account */}
      {hunter && (
        <div className={styles.header}>
          <button
            onClick={() => setActiveTab(ProfileTab.SPONSOR)}
            className={`${styles.headerButton} ${styles.left} ${
              activeTab === ProfileTab.SPONSOR ? styles.selected : ""
            }`}
          >
            <Image
              src={`/assets/icons/icons-24/case-${activeTab === ProfileTab.SPONSOR ? "black" : "white"}.svg`}
              alt="case"
              width={24}
              height={24}
            />
            Sponsor
          </button>
          <button
            onClick={() => setActiveTab(ProfileTab.HUNTER)}
            className={`${styles.headerButton} ${styles.right} ${
              activeTab === ProfileTab.HUNTER ? styles.selected : ""
            }`}
          >
            <Image
              src={`/assets/icons/icons-24/hunters-${activeTab === ProfileTab.HUNTER ? "black" : "white"}.svg`}
              alt="hunter"
              width={24}
              height={24}
            />
            Hunter
          </button>
        </div>
      )}

      {activeTab === ProfileTab.HUNTER && hunter ? (
        // HUNTER TAB
        <>
          <div className={styles.scrollable}>
            <PlayerCard key={hunter.wallet} player={hunter} />
            <div className={styles.username}>@{hunter.username}</div>
            <div className={styles.wallet}>{formatWalletAddress(hunter.wallet)}</div>
            {mintAccount && (
              <>
                <div className={styles.spacer} />
                <div className={styles.earningsContainer}>
                  <span>Total earnings</span>
                  <div className={styles.withdrawContainer}>
                    <span>{lamportsToSol(mintAccount.balance).toFixed(2)}</span>
                    <Image src="/assets/icons/icons-24/solana.svg" alt="solana" width={24} height={24} />
                    <button disabled={transactionPending} onClick={withdrawFromMint} className={styles.withdrawButton}>
                      Withdraw
                    </button>
                  </div>
                </div>
                <div className={styles.spacer} />
                <Transactions playerList={[hunter]} isProfile />
              </>
            )}
          </div>
        </>
      ) : (
        // SPONSOR TAB
        <>
          <div className={styles.scrollable}>
            <div className={styles.title}>
              Cards
              <div className={styles.spacer} />
            </div>
            <div className={styles.playerCards}>
              {playerCards.concat(heldPlayerCards).map((player) => (
                <PlayerCard key={player.wallet} player={player} sponsorHoldings={sponsorHoldings} showButtons />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
