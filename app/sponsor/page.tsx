"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";

import styles from "./page.module.css";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";

import { MarkersObject } from "@/types";
import UserInfo from "@/components/user/UserInfo";
import SponsorNavigation from "@/components/sponsor/navigation/SponsorNavigation";

import { Page } from "@/types";

enum Tab {
  LEADERBOARD,
  CARDS,
}

export default function Home() {
  const [tab, setTab] = useState(Tab.LEADERBOARD);
  const [page, setPage] = useState(Page.LEADERBOARD);
  const [closed, setClosed] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const [sponsorHoldings, setSponsorHoldings] = useState<string[]>([]);

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

  // TODO: remove - used for testing
  useEffect(() => {
    setSponsorHoldings(["1247190379537084418"]);
  }, []);

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
            <div className={styles.title}>!Title Name</div>
          </div>

          <div className={styles.content} style={closed ? { marginLeft: "100px" } : {}}>
            {/* ----- PRIZE INFO ----- */}
            <div className={styles.prizeTotal}>
              <div className={styles.prizeTotalLabel}>Total Points</div>
              <div className={styles.prizeContainer}>
                <Image src="/assets/icons/point-container-left.svg" alt="Prize graphic" width={153} height={109} />
                <div className={styles.prizeTotalAmount}>
                  1,000,000
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
                        sponsorHoldings={sponsorHoldings}
                        displaySponsorCards={tab === Tab.CARDS}
                      />
                    );
                  case Page.TRANSACTIONS:
                    return <div>Transactions</div>;
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
