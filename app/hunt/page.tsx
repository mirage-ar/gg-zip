"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";

import styles from "./page.module.css";
import LiveLeaderboardOld from "@/components/sponsor/leaderboard/LiveLeaderboardOld";
import Chat from "@/components/sponsor/chat/Chat";

import { MarkersObject } from "@/types";
import UserInfo from "@/components/user/UserInfo";

enum Tab {
  LEADERBOARD = 0,
  CHAT = 1,
}

export default function Home() {
  const [tab, setTab] = useState(Tab.LEADERBOARD);
  const [closed, setClosed] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

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

  const handleClose = () => {
    setClosed(!closed);
  };

  return (
    <>
      <div className={styles.main}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />

        <div className={styles.overlay} style={closed ? { marginRight: "-480px" } : { marginRight: "0" }}>
          <div className={styles.closeButton} onClick={handleClose}>
            <Image src="/assets/icons/icons-16/close.svg" alt="Left Image" width={16} height={16} />
          </div>

          <div className={styles.content} style={closed ? { marginLeft: "100px"} : {}}>
            {/* ----- PRIZE INFO ----- */}
            {/* <div className={styles.prizeTotal}>
              <div className={styles.prizeTotalLabel}>Total Points</div>
              <div className={styles.prizeContainer}>
                <Image src="/assets/icons/point-container-left.svg" alt="Prize graphic" width={153} height={109} />
                <div className={styles.prizeTotalAmount}>
                  1,000,000
                  <Image src="/assets/icons/icons-24/g.svg" alt="G icon" width={36} height={36} />
                </div>
                <Image src="/assets/icons/point-container-right.svg" alt="Prize graphic" width={153} height={109} />
              </div>
            </div> */}

            {/* ----- NAVIGATION ----- */}
            <div className={styles.navContainer}>
              <div
                className={`${styles.navButton} ${tab === Tab.LEADERBOARD ? styles.selected : ""}`}
                onClick={() => setTab(Tab.LEADERBOARD)}
              >
                <Image
                  src={`/assets/icons/icons-24/leaderboard-${tab === Tab.LEADERBOARD ? "black" : "white"}.svg`}
                  alt="Leaderboard"
                  width={24}
                  height={24}
                />
                Leaderboard
              </div>
              <div
                className={`${styles.navButton} ${tab === Tab.CHAT ? styles.selected : ""}`}
                onClick={() => setTab(Tab.CHAT)}
              >
                <Image
                  src={`/assets/icons/icons-24/chat-${tab === Tab.CHAT ? "black" : "white"}.svg`}
                  alt="Leaderboard"
                  width={24}
                  height={24}
                />
                Chat
              </div>
            </div>

            {/* ----- COMPONENTS ----- */}
            <div className={styles.componentContainer}>
              {tab === Tab.LEADERBOARD ? (
                <LiveLeaderboardOld flyToMarker={flyToMarker} markersRef={markersRef} />
              ) : (
                <Chat />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
