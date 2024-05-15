"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";
import UserInfo from "@/components/user/UserInfo";
import SponsorNavigation from "@/components/sponsor/navigation/SponsorNavigation";
import Transactions from "@/components/sponsor/transactions/Transactions";

import styles from "./page.module.css";

import { PublicKey } from "@solana/web3.js";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { Page, Tab, Player, MarkersObject } from "@/types";
import { getBuyPrice, getSellPrice, bnToNumber } from "@/solana";
import { useApplicationContext } from "@/state/context";
import { useSolana, useUser } from "@/hooks";
import { withCommas } from "@/utils";
import { API } from "@/utils/constants";
import BN from "bn.js";

import accounts from "./accounts.json";

import { POLLING_TIME } from "@/utils/constants";

export default function Home() {
  const [tab, setTab] = useState(Tab.LEADERBOARD);
  const [page, setPage] = useState(Page.LEADERBOARD);
  const [closed, setClosed] = useState(false);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [sponsorPoints, setSponsorPoints] = useState<number>(0);

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const { transactionPending } = useApplicationContext();
  const { program, fetchSponsorHoldings } = useSolana();
  const { publicKey } = useUser();

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

  const fetchPlayerData = async (profile: boolean): Promise<Player[]> => {
    const response = await fetch(`${API}/leaderboard`);
    const data = await response.json();

    // TODO: remove dummy data
    // const data: { leaderboard: Player[] } = {
    //   leaderboard: accounts,
    // };

    const leaderboard = data.leaderboard.sort((a: Player, b: Player) => b.points - a.points);
    let playerList: Player[] = [];

    if (profile) {
      // fetch cards the sponsor is holding
      const sponsorHoldings = await fetchSponsorHoldings();
      const holdingPlayers = leaderboard.filter((player: Player) => sponsorHoldings.includes(player.wallet));
      playerList = holdingPlayers;
    } else {
      playerList = leaderboard;
    }

    if (program === undefined) return playerList;
    for (const player of playerList) {
      try {
        const walletPublicKey = new PublicKey(player.wallet);
        const walletBuffer = walletPublicKey.toBuffer();

        const [mintPda] = await findProgramAddressSync(
          [Buffer.from("MINT"), walletBuffer],
          program.programId
        );

        const playerAccount = await program.account.mintAccount.fetch(mintPda);
        const playerCardCount = bnToNumber(playerAccount.amount as BN);

        player.buyPrice = getBuyPrice(playerCardCount, 1);
        player.sellPrice = getSellPrice(1, playerCardCount);
      } catch (error) {
        console.error(`Error fetching player card: ${player.wallet}`);
      }
    }
    return playerList;
  };

  const fetchSponsorPointTotal = async (publicKey: string, playerList: Player[]): Promise<number> => {
    try {
      const response = await fetch(`api/points/sponsor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: publicKey, players: playerList }),
      });

      const data = await response.json();
      return data.total;
    } catch (error) {
      console.error("Error fetching sponsor point total:", error);
      return 0;
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

      // fetch all player data and set state
      const players = await fetchPlayerData(tab === Tab.CARDS);
      setPlayerList(players);
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

  useEffect(() => {
    if (!publicKey || playerList.length < 1) return;
    const fetchPoints = async () => {
      // fetch sponsor point total and set state
      const points = await fetchSponsorPointTotal(publicKey.toBase58(), playerList);
      setSponsorPoints(points);
    };

    fetchPoints();
  }, [publicKey, playerList, transactionPending]);

  return (
    <>
      {/* ----- MAIN ----- */}
      <div className={styles.main}>
        <UserInfo closed={closed} />
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
              <div className={styles.prizeTotalLabel}>Total Points</div>
              <div className={styles.prizeContainer}>
                <Image src="/assets/icons/point-container-left.svg" alt="Prize graphic" width={153} height={109} />
                <div className={styles.prizeTotalAmount}>
                  {withCommas(sponsorPoints)}
                  <Image src="/assets/icons/icons-24/g.svg" alt="G icon" width={36} height={36} />
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
                        markersRef={markersRef}
                        playerList={playerList}
                        onlineUsers={onlineUsers}
                      />
                    );
                  case Page.TRANSACTIONS:
                    return <Transactions playerList={playerList} />;
                  case Page.CHAT:
                    return <Chat />;
                  case Page.POWERUPS:
                    return <div>Powerups</div>;
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
