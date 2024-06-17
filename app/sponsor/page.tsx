"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";
import SponsorNavigation from "@/components/sponsor/navigation/SponsorNavigation";
import Transactions from "@/components/sponsor/transactions/Transactions";

import styles from "./page.module.css";

import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Page, Tab, Player, MarkersObject, SponsorHoldings, Sort } from "@/types";
import { getBuyPrice, getSellPrice, bnToNumber } from "@/solana";
import { useSolana, useUser } from "@/hooks";
import { withCommas } from "@/utils";
import { GAME_API } from "@/utils/constants";
import BN from "bn.js";

import accounts from "./accounts.json";

import { POLLING_TIME } from "@/utils/constants";
import Powerups from "@/components/sponsor/powerups/Powerups";
import { useApplicationContext } from "@/state/ApplicationContext";
import Profile from "@/components/sponsor/profile/Profile";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const [tab, setTab] = useState(Tab.LEADERBOARD);
  const [page, setPage] = useState(Page.LEADERBOARD);
  const [totalHoldings, setTotalHoldings] = useState<number>(0);

  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [sponsorHoldings, setSponsorHoldings] = useState<SponsorHoldings[]>([]);
  const [sponsorPoints, setSponsorPoints] = useState<number>(0);

  const { closed, setClosed } = useApplicationContext();

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const { program, fetchSponsorHoldings, fetchPlayerCardCount } = useSolana();
  const { publicKey } = useWallet();

  const { fetchUser } = useUser();

  const fetchPlayerData = async (profile: boolean, sponsorHoldings: string[]): Promise<Player[]> => {
    const response = await fetch(`${GAME_API}/leaderboard`);
    const data = await response.json();

    // dummy data
    // const data: { leaderboard: Player[] } = {
    //   leaderboard: accounts,
    // };

    const leaderboard = data.leaderboard.sort((a: Player, b: Player) => b.points - a.points);
    let playerList: Player[] = [];

    if (profile) {
      const holdingPlayers = leaderboard.filter((player: Player) => sponsorHoldings.includes(player.wallet));
      playerList = holdingPlayers;
    } else {
      playerList = leaderboard;
    }

    // GET PLAYER CARD PRICES
    if (program === undefined) return playerList;
    await Promise.all(
      playerList.map(async (player) => {
        try {
          const walletPublicKey = new PublicKey(player.wallet);
          const walletBuffer = walletPublicKey.toBuffer();

          const [mintPda] = await findProgramAddressSync([Buffer.from("MINT"), walletBuffer], program.programId);

          const playerAccount = await program.account.mintAccount.fetch(mintPda);
          const playerCardCount = bnToNumber(playerAccount.amount as BN);

          player.buyPrice = getBuyPrice(playerCardCount, 1);
          player.sellPrice = getSellPrice(1, playerCardCount);
        } catch (error) {
          // gracefully handle error, sometimes player cards are not minted
        }
      })
    );
    return playerList;
  };

  const calculateTotalHoldings = async (playerList: Player[], sponsorHoldings: string[]): Promise<number> => {
    if (!program || !publicKey) {
      return 0;
    }

    const holdingPlayers = playerList.filter((player: Player) => sponsorHoldings.includes(player.wallet));

    let totalHoldings = 0;
    await Promise.all(
      holdingPlayers.map(async (player) => {
        // fetch how much of each player the sponsor holds
        const walletPublicKey = new PublicKey(player.wallet);
        const walletBuffer = walletPublicKey.toBuffer();

        const [tokenPda] = await findProgramAddressSync(
          [Buffer.from("TOKEN"), publicKey.toBuffer(), walletBuffer],
          program.programId
        );

        const tokenAccount = await program.account.tokenAccount.fetch(tokenPda);

        const tokenTotal = await fetchPlayerCardCount(player.wallet);

        if (tokenAccount && tokenTotal) {
          const tokenCount = bnToNumber(tokenAccount.amount as BN);

          let totalSellPrice: number = 0;

          for (let i = 0; i < tokenCount; i++) {
            const currentPrice = getSellPrice(tokenTotal - i, 1);
            totalSellPrice += currentPrice;
          }

          totalHoldings += totalSellPrice;
        }
      })
    );

    return totalHoldings;
  };

  // FLY TO USER LOCATION
  const flyToMarker = (markerId: string) => {
    const map = mapRef.current;
    const marker = markersRef.current[markerId];
    if (marker && map) {
      map.flyTo({
        center: marker.getLngLat(),
        zoom: 15,
        essential: true,
      });
    }
  };

  const getPageName = (page: Page) => {
    switch (page) {
      case Page.LEADERBOARD:
        return "Leaderboard";
      case Page.TRANSACTIONS:
        return "Transactions";
      case Page.CHAT:
        return "Chat";
      case Page.POWERUPS:
        return "Powerups";
    }
  };

  const checkOnlineUsers = (): string[] => {
    if (markersRef.current) {
      const markers = markersRef.current;
      const onlineUsers = Object.keys(markers);
      return onlineUsers;
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      // check online users and set state
      const onlineUsers = checkOnlineUsers();
      setOnlineUsers(onlineUsers);

      // fetch sponsor holdings
      const sponsorHoldings = await fetchSponsorHoldings();
      setSponsorHoldings(sponsorHoldings);

      const sponsorHoldingsWallets = sponsorHoldings.map((holding) => holding.wallet);

      // fetch all player data and set state
      const players = await fetchPlayerData(tab === Tab.CARDS, sponsorHoldingsWallets);
      setPlayerList(players);

      const holdings = await calculateTotalHoldings(players, sponsorHoldingsWallets);
      setTotalHoldings(holdings);

      // TODO: UPDATE TO SST USER
      if (publicKey) {
        const user = await fetchUser(publicKey.toBase58());
        if (user) {
          setSponsorPoints(user.points);
        }
      }
    };

    fetchData();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, POLLING_TIME);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, program, publicKey]);

  return (
    <>
      {/* ----- MAIN ----- */}
      <div className={styles.main}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />
        <SponsorNavigation page={page} setPage={setPage} closed={closed} setClosed={setClosed} />

        {/* ----- OVERLAY ----- */}
        <div className={styles.overlay} style={closed ? { marginRight: "-480px" } : { marginRight: "0" }}>
          <div className={styles.titleBar}>
            <div className={styles.closeButton} onClick={() => setClosed(!closed)}>
              <Image src="/assets/icons/icons-16/close.svg" alt="Left Image" width={16} height={16} />
            </div>
            <div className={styles.title}>{getPageName(page)}</div>
          </div>

          <div className={styles.content} style={closed ? { marginLeft: "100px" } : {}}>
            {/* ----- PRIZE INFO ----- */}
            <div className={styles.prizeTotal}>
              <div className={styles.prizeTotalLabel}>Totals</div>
              <div className={styles.prizeContainer}>
                <Image src="/assets/icons/point-container-left.svg" alt="Prize graphic" width={153} height={109} />
                <div className={styles.prizeAmountContainer}>
                  <div className={styles.prizeTotalAmount}>
                    {withCommas(sponsorPoints)}
                    <Image src="/assets/icons/icons-24/g.svg" alt="G icon" width={24} height={24} />
                  </div>
                  <div className={styles.prizeTotalAmount} style={{ color: "#ff61ef", justifyContent: "flex-start" }}>
                    {withCommas(totalHoldings.toFixed(3))}
                    <Image src="/assets/icons/icons-24/sol-pink.svg" alt="G icon" width={24} height={24} />
                  </div>
                </div>
                <Image src="/assets/icons/point-container-right.svg" alt="Prize graphic" width={153} height={109} />
              </div>
            </div>

            {/* ----- TAB NAVIGATION ----- */}
            {page === Page.LEADERBOARD && (
              <div className={styles.navContainer}>
                <div
                  className={`${styles.navButton} ${tab === Tab.LEADERBOARD ? styles.selected : ""}`}
                  onClick={() => setTab(Tab.LEADERBOARD)}
                >
                  <Image
                    src={`/assets/icons/icons-24/playercards-${tab === Tab.LEADERBOARD ? "black" : "white"}.svg`}
                    alt="Player Cards"
                    width={24}
                    height={24}
                  />
                  Player Cards
                </div>
                <div
                  className={`${styles.navButton} ${tab === Tab.CARDS ? styles.selected : ""}`}
                  onClick={() => setTab(Tab.CARDS)}
                >
                  <Image
                    src={`/assets/icons/icons-24/yourcards-${tab === Tab.CARDS ? "black" : "white"}.svg`}
                    alt="Your Cards"
                    width={24}
                    height={24}
                  />
                  Your Cards
                </div>
              </div>
            )}

            {/* ----- COMPONENTS ----- */}
            <div className={styles.componentContainer}>
              {(() => {
                switch (page) {
                  case Page.LEADERBOARD:
                    return (
                      <LiveLeaderboard
                        flyToMarker={flyToMarker}
                        playerList={playerList}
                        onlineUsers={onlineUsers}
                        sponsorHoldings={sponsorHoldings}
                      />
                    );
                  case Page.TRANSACTIONS:
                    return <Transactions playerList={playerList} />;
                  case Page.CHAT:
                    return <Chat />;
                  case Page.POWERUPS:
                    return (
                      <Powerups
                        flyToMarker={flyToMarker}
                        playerList={playerList}
                        onlineUsers={onlineUsers}
                        sponsorHoldings={sponsorHoldings}
                      />
                    );
                  case Page.PROFILE:
                    return <Profile playerList={playerList} sponsorHoldings={sponsorHoldings} />;
                  default:
                    return null;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
