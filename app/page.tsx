"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Timer from "@/components/utility/Timer";
import Link from "next/link";
import MapboxMap from "@/components/map/MapboxMap";
import BoxNotification from "@/components/sponsor/notification/BoxNotification";

import { MarkersObject } from "@/types";

export default function Home() {
  const launchDate = new Date("2024-03-30T16:00:00Z");
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  return (
    <div className={styles.main}>
      <div className={styles.map}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />
      </div>
      <div className={styles.timer}>
        <Timer date={launchDate} />
      </div>
    </div>
  );
}
