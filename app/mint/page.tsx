"use client";

// COMPONENT IMPORTS
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MapboxMap from "@/components/map/MapboxMap";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";
import Chat from "@/components/sponsor/chat/Chat";
import SponsorNavigation from "@/components/sponsor/navigation/SponsorNavigation";
import Transactions from "@/components/sponsor/transactions/Transactions";
import Powerups from "@/components/sponsor/powerups/Powerups";
import Profile from "@/components/sponsor/profile/Profile";
import SponsorLeaderboard from "@/components/sponsor/leaderboard/SponsorLeaderboard";

// STYLES
import styles from "./page.module.css";

// SOLANA UTILS
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { getBuyPrice, getSellPrice, bnToNumber } from "@/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// UTILS
import { Page, Tab, Player, MarkersObject, SponsorHoldings } from "@/types";
import { useApplicationContext } from "@/state/ApplicationContext";
import { useSolana, useUser } from "@/hooks";
import { withCommas } from "@/utils";
import { GAME_API, POLLING_TIME } from "@/utils/constants";

export default function Hunter() {

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  return (
    <>
      {/* ----- MAIN ----- */}
      <Chat />
      <div className={styles.main}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />
        </div>
    </>
  );
}
