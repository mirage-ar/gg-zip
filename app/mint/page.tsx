"use client";

// COMPONENT IMPORTS
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "@/components/map/MapboxMap";
import PlayerCard from "@/components/sponsor/card/PlayerCard";

// STYLES
import styles from "./page.module.css";

import { MarkersObject, Player, TwitterUser } from "@/types";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getSession, signIn } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolana, useUser } from "@/hooks";
import { convertImageToBase64, formatWalletAddress } from "@/utils";
import { UPLOAD_API } from "@/utils/constants";

enum Step {
  CONNECT_WALLET = 1,
  CONNECT_X = 2,
  MINT_CARD = 3,
  FINISHED = 4,
}

export default function Mint() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkersObject>({});

  const [step, setStep] = useState<Step>(Step.CONNECT_WALLET);
  const [playerCard, setPlayerCard] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { mintPlayerCard, isMinted } = useSolana();

  const { createUpdateUser } = useUser();

  const fetchTwitterUserSession = async () => {
    const session = await getSession();
    const twitterUser = session?.user as TwitterUser;

    if (twitterUser) {
      setPlayerCard({
        id: twitterUser.id,
        username: twitterUser.username,
        image: twitterUser.image,
        wallet: publicKey?.toBase58() || "",
        points: 0,
        boxes: 0,
        rank: 0,
        amount: 0,
      });
      setStep(Step.MINT_CARD);
    }
  };

  async function checkIfMinted() {
    const minted = await isMinted();
    if (minted) {
      setStep(Step.FINISHED);
    }
  }

  useEffect(() => {
    if (publicKey) {
      setStep(Step.CONNECT_X);
      fetchTwitterUserSession();
    } else {
      setStep(Step.CONNECT_WALLET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  useEffect(() => {
    if (publicKey && playerCard) {
      checkIfMinted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, playerCard]);

  const createUser = async () => {
    if (!publicKey) {
      setError("Wallet address not found.");
      return;
    }

    const session = await getSession();
    const twitterUser = session?.user as TwitterUser;

    if (twitterUser) {
      const imageUrl = twitterUser.image;
      const base64Image = await convertImageToBase64(imageUrl);

      const response = await fetch(`${UPLOAD_API}/upload`, {
        method: "POST",
        body: JSON.stringify({ image: base64Image.split(",")[1] }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Image uploaded:", data.url);

      await createUpdateUser(twitterUser.username, data.url, twitterUser.id);
    } else {
      setError("Could not create user account.");
      throw new Error("MINT: could not create user account", twitterUser);
    }
  };

  const mintCard = async () => {
    setError(null);
    if (!publicKey) {
      setError("Wallet not connected.");
      return;
    }

    if (!playerCard) {
      setError("Player card not found.");
      return;
    }

    setLoading(true);
    const result = await mintPlayerCard();
    console.log(result);

    if (!result.success) {
      setLoading(false);
      setError("Transaction failed. Please contact us on telegram.");
      return;
    }

    // await createUser();
    setStep(Step.FINISHED);
    setLoading(false);
  };

  useEffect(() => {
    const attemptToUpdateUser = async () => {
      await createUser();
    };
    if (step === Step.FINISHED) {
      attemptToUpdateUser();
    }
  }, [step]);

  const connectTwitter = async () => {
    signIn("twitter", { callbackUrl: "/mint" });
  };

  return (
    <>
      {/* ----- MAIN ----- */}
      <div className={styles.main}>
        <MapboxMap mapRef={mapRef} markersRef={markersRef} />

        <div className={styles.mintContainer}>
          <div>
            <div className={styles.title}>MINT</div>
            <div className={styles.subtitle}>
              {error ? <div className={styles.error}>{error}</div> : "1 game - 1 card"}
            </div>
            {}
          </div>
          <div className={styles.cardContainer}>
            {/* PLAYER CARD STEPS */}
            {(step === Step.CONNECT_WALLET || step === Step.CONNECT_X) && (
              <Image src="/assets/cards/mint-new.svg" alt="player card" width={241} height={274} />
            )}

            {(step === Step.MINT_CARD || step === Step.FINISHED) && playerCard !== null && (
              <PlayerCard player={playerCard} showButtons={false} />
            )}
            <div className={styles.playerCardTitle}>
              {publicKey ? formatWalletAddress(publicKey.toBase58()) : "Player Card"}
            </div>
          </div>

          {/* BUTTONS */}
          <div className={styles.buttonsContainer}>
            {step !== Step.FINISHED && (
              <div className={styles.stepsContainer}>
                <div className={styles.step}>
                  <div
                    className={
                      step === Step.CONNECT_WALLET ? `${styles.stepNumber} ${styles.selected}` : styles.stepNumber
                    }
                  >
                    1
                  </div>
                  {step === Step.CONNECT_WALLET ? (
                    <button className={styles.stepButton} onClick={() => setVisible(true)}>
                      Connect Wallet
                    </button>
                  ) : (
                    <div className={`${styles.stepButton} ${styles.finished}`}>
                      Wallet Connected
                      <Image src="/assets/icons/icons-24/check.svg" alt="checkmark" width={24} height={24} />
                    </div>
                  )}
                </div>
                <div className={styles.step}>
                  <div
                    className={step === Step.CONNECT_X ? `${styles.stepNumber} ${styles.selected}` : styles.stepNumber}
                  >
                    2
                  </div>
                  {step === Step.CONNECT_WALLET && (
                    <div className={`${styles.stepButton} ${styles.next}`}>Connect X</div>
                  )}
                  {step === Step.CONNECT_X && (
                    <button onClick={connectTwitter} className={styles.stepButton}>
                      Connect X
                    </button>
                  )}
                  {step === Step.MINT_CARD && (
                    <div className={`${styles.stepButton} ${styles.finished}`}>
                      X Connected
                      <Image src="/assets/icons/icons-24/check.svg" alt="checkmark" width={24} height={24} />
                    </div>
                  )}
                </div>
                <div className={styles.step}>
                  <div
                    className={step === Step.MINT_CARD ? `${styles.stepNumber} ${styles.selected}` : styles.stepNumber}
                  >
                    3
                  </div>
                  {step === Step.CONNECT_WALLET || step === Step.CONNECT_X ? (
                    <div className={`${styles.stepButton} ${styles.next}`}>Mint Card</div>
                  ) : (
                    <button disabled={loading} onClick={mintCard} className={styles.stepButton}>
                      {loading ? "Minting..." : "Mint Card"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
