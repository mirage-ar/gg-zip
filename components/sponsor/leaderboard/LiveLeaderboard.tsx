"use client";

import React, { useEffect, useState } from "react";
import TradingView from "@/components/sponsor/trade/TradingView";
import Image from "next/image";

import styles from "./LiveLeaderboard.module.css";
import { Player, SponsorHoldings, Sort } from "@/types";
import { withCommas } from "@/utils";
import SearchBar from "@/components/utility/SearchBar";

interface LiveLeaderboardProps {
  flyToMarker: (markerId: string) => void;
  playerList: Player[];
  onlineUsers: string[];
  sponsorHoldings: SponsorHoldings[];
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ flyToMarker, playerList, onlineUsers, sponsorHoldings }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);

  const [pointsSorted, setPointsSorted] = useState<Sort>(Sort.ASCENDING);
  const [priceSorted, setPriceSorted] = useState<Sort>(Sort.NONE);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);

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

  const sponsorHoldingsWallets = sponsorHoldings.map((holding) => holding.wallet);

  function openTradingView(player: Player, rank: number) {
    player.rank = rank;
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

  return (
    <div className={styles.container}>
      {/* ----- TRADING VIEW ----- */}
      {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ----- HEADER ----- */}
      <div className={styles.header}>
        <div className={styles.leftColumn}>
          <span>Rank</span>
          <span>Name</span>
          <span>
            <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
          </span>
          <span>
            <Image src="/assets/icons/icons-24/box-opened-green.svg" alt="Coin Icon" width={24} height={24} />
          </span>
          <div className={styles.filterIcon} onClick={togglePointsSort}>{pointsIcon}</div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.priceHeader}>
            <span>Price</span>
            <Image src="/assets/icons/icons-24/solana.svg" alt="Solana Icon" width={24} height={24} />
          </div>
          <div className={styles.filterIcon} onClick={togglePriceSort}>{priceIcon}</div>
        </div>
      </div>

      <div className={styles.scrollable}>
        {/* ----- LEADERBOARD ------ */}
        {filteredPlayers.length > 0 &&
          filteredPlayers.map(
            (player, index) =>
              player.points > 0 && (
                <div key={player.id}>
                  <div
                    className={styles.leaderboardRow}
                    style={
                      sponsorHoldingsWallets.includes(player.wallet)
                        ? { backgroundColor: "rgba(66, 255, 96, 0.2)" }
                        : {}
                    }
                  >
                    <div className={styles.playerInfo} onClick={() => flyToMarker(player.id)}>
                      <div className={styles.playerRank}>{index + 1}</div>
                      <div className={styles.playerMarker}>
                        {onlineUsers.includes(player.id) && <div className={styles.onlineMarker} />}
                        <Image
                          className={`${styles.playerImage} ${onlineUsers.includes(player.id) && styles.online}`}
                          src={player.image}
                          alt="User Image"
                          width={150}
                          height={150}
                        />
                      </div>
                      <div className={styles.playerNameContainer}>
                        <div className={styles.playerName}>
                          @{player.username}
                          {sponsorHoldings.find((user) => user.wallet === player.wallet) && (
                            <div className={styles.sponsorHoldingAmount}>
                              <Image src="/assets/icons/icons-16/check-mark.svg" alt="Check" width={16} height={16} />
                              {sponsorHoldings.find((user) => user.wallet === player.wallet)?.amount}
                            </div>
                          )}
                        </div>
                        <div className={styles.playerScoreContainer}>
                          <div className={styles.playerScore}>{withCommas(player.points)}</div>
                          <div className={styles.dot}>•</div>
                          <div className={styles.playerBoxes}>{withCommas(player.boxes)}</div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.priceContainer}>
                      <div className={styles.price}>{withCommas(player.buyPrice?.toFixed(3) || 0)}</div>
                      <button
                        className={styles.tradeButton}
                        disabled={!player.buyPrice}
                        onClick={() => openTradingView(player, index + 1)}
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                  { index !== filteredPlayers.length - 1 && <div className={styles.spacer} /> }
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default LiveLeaderboard;
