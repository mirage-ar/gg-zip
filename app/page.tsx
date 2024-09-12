"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import styles from "./page.module.css";

import Timer from "@/components/utility/Timer";
import MapboxMap from "@/components/map/MapboxMap";

import { MarkersObject } from "@/types";
import { getGameStartTime } from "@/utils";
import { GAME_API, GAME_DATE, PLAYER_COUNT, POLLING_TIME, PAUSE } from "@/utils/constants";

const FIVE_MINUTES = 1000 * 60 * 5;
const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = 1000 * 60 * 60 * 24;

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const router = useRouter();

  const [hover, setHover] = useState(false);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <>
      <div className={styles.main}>
        <div className={styles.map}>
          <MapboxMap mapRef={mapRef} markersRef={markersRef} isHomePage />
        </div>

        {!hover && <div className={styles.coins} />}
        {hover && <div className={styles.coinsHover} />}

        <div className={styles.mainContainer}>
          <div className={styles.title}>Go outside, collect memecoins worldwide!</div>

          <Image
            className={styles.titleImage}
            src="/assets/icons/icons-24/box-opened-green.svg"
            alt="Box Icon"
            width={48}
            height={48}
          />

          <div
            className={styles.button}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={() => router.push("/hunter")}
          >
            <div className={styles.buttonGraphic}></div>
            Enter the Game
            <div className={styles.buttonGraphicRight}></div>
          </div>
        </div>
      </div>
    </>
  );
}
