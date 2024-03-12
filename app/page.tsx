"use client";

import React, { useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Timer from "@/components/utility/Timer";
import Link from "next/link";
import MapboxMap from "@/components/map/MapboxMap";

import { MarkersObject } from "@/types";

export default function Home() {
  const launchDate = new Date("2024-03-11T17:00:00Z");
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  return (
    <div className={styles.main}>
      <div className={styles.map}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />
      </div>
      <div className={styles.fill}>
        <img src="/assets/graphics/hunt.svg" alt="Details" />
      </div>
      {/* <div className={styles.container}>
        <div className={styles.leftCard}>
          <div className={styles.topContent}>
            <Image src="/assets/graphics/beta.gif" alt="Beta" width={89} height={26} />
            <h1>
              The Reaping
              <br />
              NYC
            </h1>
          </div>
          <div className={styles.centerContent}>
            <div className={styles.boxContainer}>
              <div className={styles.boxContent}>
                <h2>DATE TBA</h2>
                <div className={styles.leftBox}>********</div>
              </div>
              <div className={styles.boxContent}>
                <h2>PRIZE</h2>
                <div className={styles.rightBox}>
                  1,000,000
                  <Image src="/assets/icons/icons-24/g.svg" alt="Coin Icon" width={24} height={24} />
                </div>
              </div>
            </div>
            <div className={styles.timer}>
              <Timer date={launchDate} />
            </div>

            <p>
              Only 25 degens will be selected for the hunt in NYC.
              <br />
              Volunteer before the deadline
              <br />
              @March 11 NOON EST.
            </p>
          </div>

          <div className={styles.spacer} />
          <div className={styles.bottomContent}>
            <Image src="/assets/icons/box-black.svg" alt="Koji" width={24} height={24} />
            <p>Hunters Announced Next Week</p>
          </div>
        </div>
        <div className={styles.rightCard}>
          <div className={styles.borderPulse}>
            <Link target="_blank" className={styles.button} href={"https://gg-zip.typeform.com/hunter"}>
              Volunteer as tribute
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}
