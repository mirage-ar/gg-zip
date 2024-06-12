// pages/BlankPage.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const BlankPage: React.FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>
        HOW TO PLAY ON
        <br />
        TESTNET
      </h1>
      {/* STEP ONE */}
      <div className={styles.container}>
        <div className={styles.number}>1</div>
        <div className={styles.titleContainer}>
          <Image src="/assets/graphics/testnet/left.svg" alt="spacer" width={14} height={58} />
          <span className={styles.text}>
            Switch wallet to devnet:
            <br />
            settings -&gt; developer settings -&gt; testnet mode
          </span>
          <Image src="/assets/graphics/testnet/right.svg" alt="spacer" width={14} height={58} />
        </div>
        <div className={styles.graphicContainer}>
          <Image src="/assets/graphics/testnet/wallet1.png" alt="step 1" width={261} height={437} />
          <Image src="/assets/graphics/testnet/arrow.svg" alt="step 1" width={24} height={24} />
          <Image src="/assets/graphics/testnet/wallet2.png" alt="step 1" width={261} height={437} />
        </div>
      </div>

      {/* STEP TWO */}
      <div className={styles.container}>
        <div className={styles.number}>2</div>
        <div className={styles.titleContainer}>
          <Image src="/assets/graphics/testnet/left.svg" alt="spacer" width={14} height={58} />
          <span className={styles.text}>
            Get devnet sol via:
            <br />
            <Link href="https://faucet.solana.com/">faucet.solana.com</Link>
          </span>
          <Image src="/assets/graphics/testnet/right.svg" alt="spacer" width={14} height={58} />
        </div>
        <div className={styles.graphicContainer}>
          <Image src="/assets/graphics/testnet/solana.png" alt="step 1" width={380} height={238} />
        </div>
      </div>

      {/* STEP THREE */}
      <div className={styles.container}>
        <div className={styles.number}>3</div>
        <div className={styles.titleContainer}>
          <Image src="/assets/graphics/testnet/left.svg" alt="spacer" width={14} height={58} />
          <span className={styles.text}>
            Mint player card via:
            <br />
            <Link href="/mint">gg.zip/mint</Link>
          </span>
          <Image src="/assets/graphics/testnet/right.svg" alt="spacer" width={14} height={58} />
        </div>
      </div>
      <div className={styles.footer}>
        <span>May the odds be ever in your favor anon</span>
        <Image src="/assets/graphics/koji.png" alt="koji" width={50} height={50} />
      </div>
    </div>
  );
};

export default BlankPage;
