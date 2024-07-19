"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import SearchBar from "@/components/utility/SearchBar";

// STYLES
import styles from "./page.module.css";

// TYPES + HOOKS
import { Player, Sort, SponsorHoldings } from "@/types";
import { abbreviateString, rand, withCommas } from "@/utils";
import { useApplicationContext } from "@/state/ApplicationContext";
import { useSolana } from "@/hooks";

// SOLANA UTILS
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { getBuyPrice, getSellPrice, bnToNumber } from "@/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import TradingView from "@/components/sponsor/trade/TradingView";
import { POLLING_TIME } from "@/utils/constants";

enum LeaderboardTab {
  HUNTERS,
  SPONSORS,
}

const sponsorHoldings: SponsorHoldings[] = [];

export default function LeaderboardPage() {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [hunterWallets, setHunterWallets] = useState<string[]>([]);
  const [sponsorHoldings, setSponsorHoldings] = useState<SponsorHoldings[]>([]);
  const [sponsorList, setSponsorList] = useState<Player[]>([]);

  const [tab, setTab] = useState<LeaderboardTab>(LeaderboardTab.HUNTERS);
  const [searchQuery, setSearchQuery] = useState("");

  const [pointsSorted, setPointsSorted] = useState<Sort>(Sort.ASCENDING);
  const [priceSorted, setPriceSorted] = useState<Sort>(Sort.NONE);

  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const { transactionPending } = useApplicationContext();
  const { program, fetchSponsorHoldings, calculateTotalHoldings } = useSolana();

  const sponsorHoldingsWallets = sponsorHoldings.map((holding) => holding.wallet);

  const fetchPlayerData = async (): Promise<Player[]> => {
    const random = rand(0, 1000);
    const response = await fetch(`/api/leaderboard/hunters/${random}`);
    const result = await response.json();
    const playerList = result.data;

    // GET PLAYER CARD PRICES
    if (program === undefined) return playerList;
    await Promise.all(
      playerList.map(async (player: Player) => {
        try {
          const walletPublicKey = new PublicKey(player.wallet);
          const walletBuffer = walletPublicKey.toBuffer();

          const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

          const playerAccount = await program.account.mintAccount.fetch(mintPda);
          const playerCardCount = bnToNumber(playerAccount.amount as BN);

          player.buyPrice = getBuyPrice(playerCardCount, 1);
          player.sellPrice = getSellPrice(1, playerCardCount);
          player.cardCount = playerCardCount;
        } catch (error) {
          // gracefully handle error, sometimes player cards are not minted
        }
      })
    );

    // set player rank for each player - mutation not ideal
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].rank = i + 1;
    }

    return playerList;
  };

  const fetchPlayerList = async () => {
    try {
      const players = await fetchPlayerData();
      setPlayerList(players);
    } catch (error) {
      console.error("Error fetching player list:", error);
    }
  };

  const fetchSponsorList = async () => {
    try {
      const random = rand(0, 1000);
      const response = await fetch(`/api/leaderboard/sponsors/${random}`);
      const result = await response.json();
      let sponsors = result.data;

      // set player rank for each player - mutation not ideal
      for (let i = 0; i < sponsors.length; i++) {
        sponsors[i].rank = i + 1;
      }

      setPlayerList(sponsors);
    } catch (error) {
      console.error("Error fetching sponsor list:", error);
    }
  };

  // Fetch sponsor holdings
  const fetchSponsorHoldingsData = async () => {
    try {
      const holdings = await fetchSponsorHoldings();
      setSponsorHoldings(holdings);
    } catch (error) {
      console.error("Error fetching sponsor holdings:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (tab === LeaderboardTab.HUNTERS) {
        await fetchPlayerList();
        await fetchSponsorHoldingsData();
      } else {
        await fetchSponsorList();
      }
    };

    fetchData();
  }, [program, tab]);

  useEffect(() => {
    const fetchData = async () => {
      if (tab === LeaderboardTab.HUNTERS) {
        await fetchPlayerList();
        await fetchSponsorHoldingsData();
      } else {
        await fetchSponsorList();
      }
    };

    fetchData();
  }, [transactionPending]);

  function openTradingView(player: Player) {
    setTradingViewPlayer(player);
    setShowOverlay(true);
  }

  function togglePointsSort() {
    const newSort = pointsSorted === Sort.ASCENDING ? Sort.DESCENDING : Sort.ASCENDING;
    setPointsSorted(newSort);
    setPriceSorted(Sort.NONE);
  }

  function togglePriceSort() {
    const newSort = priceSorted === Sort.ASCENDING ? Sort.DESCENDING : Sort.ASCENDING;
    setPriceSorted(newSort);
    setPointsSorted(Sort.NONE);
  }

  let pointsIcon;
  let priceIcon;

  switch (pointsSorted) {
    case Sort.ASCENDING:
      pointsIcon = (
        <Image src="/assets/icons/icons-24/sort-ascending.svg" alt="Sort Ascending" width={24} height={24} />
      );
      break;
    case Sort.DESCENDING:
      pointsIcon = (
        <Image src="/assets/icons/icons-24/sort-descending.svg" alt="Sort Descending" width={24} height={24} />
      );
      break;
    case Sort.NONE:
      pointsIcon = <Image src="/assets/icons/icons-24/sort-none.svg" alt="Sort None" width={24} height={24} />;
      break;
    default:
      pointsIcon = (
        <Image src="/assets/icons/icons-24/sort-ascending.svg" alt="Sort Ascending" width={24} height={24} />
      );
  }

  switch (priceSorted) {
    case Sort.ASCENDING:
      priceIcon = <Image src="/assets/icons/icons-24/sort-ascending.svg" alt="Sort Ascending" width={24} height={24} />;
      break;
    case Sort.DESCENDING:
      priceIcon = (
        <Image src="/assets/icons/icons-24/sort-descending.svg" alt="Sort Descending" width={24} height={24} />
      );
      break;
    case Sort.NONE:
      priceIcon = <Image src="/assets/icons/icons-24/sort-none.svg" alt="Sort None" width={24} height={24} />;
      break;
    default:
      priceIcon = <Image src="/assets/icons/icons-24/sort-none.svg" alt="Sort None" width={24} height={24} />;
  }

  useEffect(() => {
    // Function to apply sorting and filtering
    const applySortingAndFiltering = () => {
      let sortedPlayers = [...playerList];

      if (pointsSorted !== Sort.NONE) {
        sortedPlayers =
          pointsSorted === Sort.ASCENDING
            ? sortedPlayers.sort((a, b) => b.points - a.points)
            : sortedPlayers.sort((a, b) => a.points - b.points);
      }

      if (priceSorted !== Sort.NONE) {
        sortedPlayers =
          priceSorted === Sort.ASCENDING
            ? sortedPlayers.sort((a, b) => (b.buyPrice || 0) - (a.buyPrice || 0))
            : sortedPlayers.sort((a, b) => (a.buyPrice || 0) - (b.buyPrice || 0));
      }

      sortedPlayers = sortedPlayers.filter((player) =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredPlayers(sortedPlayers);
    };

    applySortingAndFiltering();
  }, [searchQuery, playerList, pointsSorted, priceSorted]);

  return (
    <>
      {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}
      <div className={styles.main}>
        <div className={styles.scrollable}>
          <div className={styles.title}>Leaderboard</div>
          <div className={styles.container}>
            <div className={styles.buttonContainer}>
              <button
                className={`${styles.headerButton} ${styles.left} ${
                  tab === LeaderboardTab.HUNTERS ? styles.selected : ""
                }`}
                onClick={() => setTab(LeaderboardTab.HUNTERS)}
              >
                <Image
                  src={`/assets/icons/icons-24/hunters-${tab === LeaderboardTab.HUNTERS ? "black" : "white"}.svg`}
                  alt="Hunter button"
                  width={24}
                  height={24}
                />
                Hunters
              </button>
              <button
                className={`${styles.headerButton} ${styles.right} ${
                  tab === LeaderboardTab.SPONSORS ? styles.selected : ""
                }`}
                onClick={() => setTab(LeaderboardTab.SPONSORS)}
              >
                <Image
                  src={`/assets/icons/icons-24/case-${tab === LeaderboardTab.SPONSORS ? "black" : "white"}.svg`}
                  alt="Sponsor button"
                  width={24}
                  height={24}
                />
                Sponsors
              </button>
            </div>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} width={500} />

            {/* ----- HEADER ----- */}

            <div className={styles.header}>
              <div className={styles.leftColumn}>
                <span>Rank</span>
                <span>Name</span>
              </div>

              <div className={styles.centerColumn}>
                <span className={styles.headerRowElement}>
                  Total
                  <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
                  <div className={styles.filterIcon} onClick={togglePointsSort}>
                    {pointsIcon}
                  </div>
                </span>

                {/* <span className={styles.headerRowElement}>
              Total
              <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Box Icon" width={24} height={24} />
            </span> */}
              </div>

              {tab === LeaderboardTab.HUNTERS && (
                <div className={styles.rightColumn}>
                  <div className={styles.priceHeader}>
                    <span>Price</span>
                    <Image src="/assets/icons/icons-24/solana.svg" alt="Solana Icon" width={24} height={24} />
                  </div>
                  <div className={styles.filterIcon} onClick={togglePriceSort}>
                    {priceIcon}
                  </div>
                </div>
              )}
            </div>

            {/* ----- ROWS ----- */}

            {/* ----- LEADERBOARD ------ */}
            {filteredPlayers.length > 0 &&
              filteredPlayers.map(
                (player, index) =>
                  player.points > 0 &&
                  (tab === LeaderboardTab.HUNTERS ? player.buyPrice : true) && (
                    <div key={player.id}>
                      <div
                        className={styles.leaderboardRow}
                        style={
                          sponsorHoldingsWallets.includes(player.wallet)
                            ? { backgroundColor: "rgba(66, 255, 96, 0.2)" }
                            : {}
                        }
                      >
                        <div className={styles.playerInfo}>
                          <div className={styles.playerRank}>{player.rank}</div>
                          <div className={styles.playerMarker}>
                            <Image
                              className={styles.playerImage}
                              src={player.image || "/assets/icons/koji.png"}
                              alt=""
                              width={150}
                              height={150}
                            />
                          </div>
                          <div className={styles.playerNameContainer}>
                            <div className={styles.playerName}>
                              @{abbreviateString(player.username, 25)}
                              {sponsorHoldings.find((user) => user.wallet === player.wallet) && (
                                <div className={styles.sponsorHoldingAmount}>
                                  {sponsorHoldings.find((user) => user.wallet === player.wallet)?.amount}
                                  <Image
                                    src="/assets/icons/icons-16/player-card.svg"
                                    alt="Check"
                                    width={16}
                                    height={16}
                                  />
                                  {sponsorHoldings
                                    .find((user) => user.wallet === player.wallet)
                                    ?.percentage?.toFixed(1)}
                                  %{" "}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.playerScoreContainer}>
                          <div className={styles.playerScore}>{withCommas(player.points)}</div>
                          {/* <div className={styles.dot}>•</div>
                        <div className={styles.playerBoxes}>{player.boxes}</div> */}
                        </div>

                        {tab === LeaderboardTab.HUNTERS && (
                          <div className={styles.priceContainer}>
                            <div className={styles.price}>{withCommas(player.buyPrice?.toFixed(3) || 0)}</div>
                            <button
                              className={styles.tradeButton}
                              disabled={!player.buyPrice || transactionPending}
                              onClick={() => openTradingView(player)}
                            >
                              Trade
                            </button>
                          </div>
                        )}
                      </div>
                      {index !== filteredPlayers.length - 1 && <div className={styles.spacer} />}
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </>
  );
}
