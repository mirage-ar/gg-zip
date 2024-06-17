"use client";

import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import styles from "./page.module.css";
import React, { useRef } from "react";
import Winners from "@/components/sponsor/winners/Winners";

import { MarkersObject } from "@/types";

export default function GameOver() {
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
      <div className={styles.gameOver}>
        <div className={styles.gameOverTitle}>
          <h1>Game Over</h1>
        </div>
      </div>
      <div className={styles.overlay}>
        {/* ----- RESULTS HEADER ----- */}
        <div className={styles.header}>
          <div className={styles.leftImage}>
            <Image src="/assets/graphics/left.svg" alt="Left Image" width={153} height={109} />
          </div>
          <h1>Results</h1>
          <div className={styles.rightImage}>
            <Image src="/assets/graphics/right.svg" alt="Right Image" width={153} height={109} />
          </div>
        </div>

        {/* ----- COMPONENTS ----- */}
        <div className={styles.componentContainer}>
          <Winners flyToMarker={flyToMarker} markersRef={markersRef} />
        </div>
      </div>
    </div>
  );
}
