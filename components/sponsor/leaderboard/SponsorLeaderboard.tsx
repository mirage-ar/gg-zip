"use client";

import React, { useEffect, useState } from "react";
import TradingView from "@/components/sponsor/trade/TradingView";
import Image from "next/image";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";

import styles from "./SponsorLeaderboard.module.css";

import { Player, Sort, Sponsor, SponsorHoldings } from "@/types";
import { abbreviateString, withCommas } from "@/utils";
import SearchBar from "@/components/utility/SearchBar";
import { useApplicationContext } from "@/state/ApplicationContext";
import { useSolana } from "@/hooks";

interface SponsorLeaderboardProps {
  flyToMarker: (markerId: string) => void;
  playerList: Player[];
  onlineUsers: string[];
}

const SponsorLeaderboard: React.FC<SponsorLeaderboardProps> = ({ flyToMarker, playerList, onlineUsers }) => {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);

  const [pointsSorted, setPointsSorted] = useState<Sort>(Sort.ASCENDING);
  const [searchQuery, setSearchQuery] = useState("");

  const [showHoldings, setShowHoldings] = useState<string | null>(null);
  const [holdingsViewPlayers, setHoldingsViewPlayers] = useState<Player[]>([]);

  const { fetchSponsorHoldings } = useSolana();

  const showHoldingsView = async (wallet: string) => {
    setLoading(true);
    if (showHoldings === wallet) {
      setShowHoldings(null);
      setHoldingsViewPlayers([]);
    } else {
      setShowHoldings(wallet);

      const sponsor = sponsors.find((sponsor) => sponsor.wallet === wallet);
      if (!sponsor?.holdings) {
        const holdings = await fetchSponsorHoldings(sponsor?.wallet);
        if (sponsor && holdings) {
          sponsor.holdings = holdings;
        }
      }
      let holdingsViewPlayers: Player[] = [];

      for (const player of playerList) {
        for (const holding of sponsor?.holdings || []) {
          if (holding.wallet === player.wallet) {
            holdingsViewPlayers.push(player);
          }
        }
      }

      setHoldingsViewPlayers(holdingsViewPlayers);
    }
    setLoading(false);
  };

  function togglePointsSort() {
    const newSort = pointsSorted === Sort.ASCENDING ? Sort.DESCENDING : Sort.ASCENDING;
    setPointsSorted(newSort);
  }

  let pointsIcon;
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

  // FETCH DATA
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
      const response = await fetch(`api/sponsors`);
      const result = await response.json();

      if (!result.success) throw new Error("Failed to fetch sponsors");

      const sponsors = result.data;

      setSponsors(sponsors);

      } catch (error) {
        throw new Error(`Fetch sponsors error: ${error}`);
      }
    };

    fetchSponsors();

    // SPONSOR LEADERBOARD IS NOT LIVE !! too many alchemy requests
    // const interval = setInterval(() => {
    //   if (document.visibilityState === "visible") {
    //     fetchSponsors();
    //   }
    // }, POLLING_TIME);

    // return () => clearInterval(interval);
  }, []);

  // SORTING AND FILTERING
  useEffect(() => {
    // Function to apply sorting and filtering
    const applySortingAndFiltering = async () => {
      let sortedSponsors: Sponsor[] = [...sponsors];

      // set sponsor rank + holdings
      for (let i = 0; i < sortedSponsors.length; i++) {
        sortedSponsors[i].rank = i + 1;
      }

      if (pointsSorted !== Sort.NONE) {
        sortedSponsors =
          pointsSorted === Sort.ASCENDING
            ? sortedSponsors.sort((a, b) => (b.gamePoints || 0) - (a.gamePoints || 0))
            : sortedSponsors.sort((a, b) => (a.gamePoints || 0) - (b.gamePoints || 0));
      }

      sortedSponsors = sortedSponsors.filter((sponsor) =>
        sponsor.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredSponsors(sortedSponsors);
    };

    applySortingAndFiltering();
  }, [searchQuery, pointsSorted, sponsors]);

  return (
    <div className={styles.container}>
      {/* ----- TRADING VIEW ----- */}
      {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ----- HEADER ----- */}
      <div className={styles.header}>
        <div className={styles.leftColumn}>
          <span>Rank</span>
          <span>Sponsors</span>
        </div>

        <div className={styles.middleColumn}>
          <span>
            <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
          </span>
          <div className={styles.filterIcon} onClick={togglePointsSort}>
            {pointsIcon}
          </div>
        </div>

        <div className={styles.rightColumn}>
          Cards
          <Image src="/assets/icons/icons-24/playercards-green.svg" alt="Cards Icon" width={24} height={24} />
        </div>
      </div>

      <div className={styles.scrollable}>
        {/* ----- LEADERBOARD ------ */}
        {filteredSponsors.length > 0 &&
          filteredSponsors.map(
            (sponsor, index) =>
              sponsor.points > 0 && (
                <div key={sponsor.id}>
                  <div className={styles.leaderboardRow}>
                    <div className={styles.sponsorInfo}>
                      {/* TODO: was sponsor.rank ||  */}
                      <div className={styles.sponsorRank}>{sponsor.rank || index + 1}</div>
                      <div className={styles.sponsorMarker}>
                        <Image
                          className={styles.sponsorImage}
                          src={sponsor.image || "/assets/graphics/koji.png"}
                          alt="User Image"
                          width={150}
                          height={150}
                        />
                      </div>
                      <div className={styles.sponsorNameContainer}>
                        <div className={styles.sponsorName}>{abbreviateString(sponsor.username, 14)}</div>
                      </div>
                    </div>
                    <div className={styles.sponsorScoreContainer}>{withCommas(sponsor.gamePoints)}</div>

                    <div className={styles.sponsorHoldingsContainer}>
                      <button
                        className={styles.holdingsButton}
                        onClick={async () => await showHoldingsView(sponsor.wallet)}
                      >
                        {showHoldings === sponsor.wallet ? (
                          <Image src="/assets/icons/icons-16/arrow-up.svg" alt="up arrow" width={16} height={16} />
                        ) : (
                          <Image src="/assets/icons/icons-16/arrow-d.svg" alt="down arrow" width={16} height={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  {loading && showHoldings === sponsor.wallet && <div className={styles.loading}>Loading...</div>}
                  {showHoldings === sponsor.wallet && !loading && (
                    <div className={styles.holdingsContainer}>
                      {sponsor.holdings && sponsor.holdings.length > 0 ? (
                        <LiveLeaderboard
                          playerList={holdingsViewPlayers}
                          flyToMarker={flyToMarker}
                          onlineUsers={onlineUsers}
                          sponsorHoldings={sponsor.holdings}
                          showSearch={false}
                          showHeader={false}
                          showHoldingHighlight={false}
                          abbreviateNames
                        />
                      ) : (
                        <div className={styles.noHoldings}>No holdings</div>
                      )}
                    </div>
                  )}
                  {index !== sponsors.length - 1 && <div className={styles.spacer} />}
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default SponsorLeaderboard;
