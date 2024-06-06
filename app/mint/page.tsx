"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import PlayerCard from "@/components/sponsor/card/PlayerCard";
import UserInfo from "@/components/user/UserInfo";

import styles from "./page.module.css";

import { useApplicationContext } from "@/state/ApplicationContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSolana, useUser } from "@/hooks";
import { formatWalletAddress } from "@/utils";
import { Player } from "@/types";

enum Step {
  CONNECT_WALLET = 1,
  CONNECT_X = 2,
  MINT_CARD = 3,
  FINISHED = 4,
}

export default function Mint() {
  const [step, setStep] = useState<Step>(Step.CONNECT_WALLET);
  const [playerCard, setPlayerCard] = useState<Player | null>(null);

  const { twitterUser } = useUser();

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { mintPlayerCard, isMinted } = useSolana();

  useEffect(() => {
    if (publicKey) {
      setStep(Step.CONNECT_X);
    }

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

    async function checkIfMinted() {
      const minted = await isMinted();
      if (minted) {
        setStep(Step.FINISHED);
      }
    }

    if (publicKey && twitterUser) {
      checkIfMinted();
    }
  }, [publicKey, twitterUser]);

  const mintCard = async () => {
    if (!publicKey) return;
    if (!twitterUser) return;

    await mintPlayerCard();
    await createUser();
    setStep(Step.FINISHED);
  };

  const createUser = async () => {
    if (!publicKey) return;
    if (!twitterUser) return;

    const createResponse = await fetch(`/api/user/${publicKey.toBase58()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: twitterUser.username,
        image: twitterUser.image,
        twitterId: twitterUser.id,
      }),
    });

    const result = await createResponse.json();
  };

  const connectTwiiter = async () => {
    signIn("twitter", { callbackUrl: "/mint" });
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          {step === Step.FINISHED && (
            <video className={styles.videoBackground} autoPlay loop muted>
              <source src="/assets/video/mint.mp4" type="video/mp4" />
            </video>
          )}
          <div className={styles.header}>Mint Player Card</div>
          <div className={styles.cardContainer}>
            {/* PLAYER CARD STEPS */}
            {step === Step.CONNECT_WALLET && (
              <Image src="/assets/cards/mint-1.svg" alt="player card" width={241} height={365} />
            )}
            {step === Step.CONNECT_X && (
              <Image src="/assets/cards/mint-2.svg" alt="player card" width={241} height={365} />
            )}
            {step === Step.MINT_CARD && playerCard !== null && <PlayerCard player={playerCard} showButtons={false} />}
            {step === Step.FINISHED && playerCard !== null && <PlayerCard player={playerCard} showButtons={false} />}
          </div>

          {/* USER INFO */}
          <div className={styles.userInfo}>
            <div className={styles.userName}>{twitterUser ? `@${twitterUser.username}` : ""}</div>
            <div className={styles.wallet}>{publicKey ? formatWalletAddress(publicKey.toBase58()) : ""}</div>
          </div>

          {/* BUTTONS */}
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
                {step === Step.CONNECT_WALLET && <div className={`${styles.stepButton} ${styles.next}`}>Connect X</div>}
                {step === Step.CONNECT_X && (
                  <button onClick={connectTwiiter} className={styles.stepButton}>
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
                  <button onClick={mintCard} className={styles.stepButton}>
                    Mint Card
                  </button>
                )}
              </div>
            </div>
          )}

          {step === Step.FINISHED && (
            <div className={styles.finishedContainer}>
              <div className={styles.greenOne}>Card Minted!</div>
              <div className={styles.greenTwo}>
                <div className={styles.infoContainer}>
                  <div className={styles.infoLeft}>
                    <Image src="/assets/icons/icons-24/hunters.svg" alt="checkmark" width={24} height={24} />
                    download gg app on
                    <br />
                    HUNT.GG.ZIP
                  </div>
                  <Image src="/assets/graphics/QR.svg" alt="arrow" width={85} height={85} />
                </div>
              </div>
              <div className={styles.greenThree} />
              {/* <div className={styles.blackOne} />
              <div className={styles.blackTwo} /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
