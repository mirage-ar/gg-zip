"use client";

import React from "react";
import Image from "next/image";

import styles from "./page.module.css";
import Link from "next/link";

export default function HowToPage() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>How to play</h1>
          </div>

          <div className={styles.section}>
            <h4>• GG IS AN IRL MEMCOIN RACE</h4>
            <h4>• Games Last One Hour </h4>
            <h4>• Collect Instantly Tradeable Tokens in Your City </h4>
            <h4>• Climb the Leaderboard and Win the Game</h4>

            <p>
              1. Mint Ticket You will need to mint a ticket with SOL on our website to join The Hunt. 1 Ticket = 1 GG
              Hunt Entry. Tickets are .25 SOL each. We will connect your wallet address to your Twitter to pay out your
              tokens.
            </p>

            <p>
              2. JOIN THE HUNT APP Once your ticket is minted, download The Hunt webapp and wait for the next Hunt to
              begin.
            </p>

            <p>
              3. COLLECT BOXES When the game begins, log into GG with your Twitter. No matter where you are we will
              auto-drop boxes around you. The more friends who join GG at the same place, the more boxes in that area.
              Every game a different liquid meme coin will be in the boxes - race to collect as much of the coin as you
              can. All holdings will be instantly tradable once collected. We recommend hunting with friends in an open
              space area (Park. Field, etc.)
            </p>
            <p>4. CLIMB LEADERBOARD Race Against the World, Stack Coins, and Win the Hunt</p>
          </div>
        </div>
      </div>
    </>
  );
}
