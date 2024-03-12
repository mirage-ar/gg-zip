"use client";

import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import styles from "./page.module.css";
import React, { useRef } from "react";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";

enum Tab {
  LEADERBOARD = 0,
  CHAT = 1,
}

type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

export default function Home() {
  const [tab, setTab] = React.useState(Tab.LEADERBOARD);
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

  return (
    <div className={styles.main}>
      <MapboxMap mapRef={mapRef} markersRef={markersRef} />
      <div className={styles.overlay}>
        {/* ----- PRIZE INFO ----- */}
        {/* <div className={styles.prizeTotal}>
          <div className={styles.prizeTotalLabel}> Prize Pool</div>
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
        <div className={styles.componentContainer}>{tab === Tab.LEADERBOARD ? <LiveLeaderboard flyToMarker={flyToMarker} /> : <Chat />}</div>
      </div>
    </div>
  );
}
