"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import CodeInput from "@/components/utility/CodeInput";
import ConnectWallet from "@/components/wallet/ConnectWallet";

import { isMobile } from "@/utils";

import styles from "./page.module.css";
import { on } from "events";

const Page: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const getCode = params.get("code");
  const { publicKey } = useWallet();
  const [code, setCode] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const onMobile = isMobile();

  return (
    <div className={styles.main}>
      <div className={styles.tooltip} style={showTooltip ? { opacity: "1" } : {}}>
        Airdrop based on your Solana Activity / Manlet Meter (More Degen, More G)
      </div>
      <h1>Solana Hunger Games</h1>
      <h4 style={{ marginTop: "16px" }}>Coming Spring 2024</h4>
      <div className={styles.container}>
        <h3>
          <Image src="/assets/icons/icons-24/g-invert.svg" alt="box" width={32} height={32} />
          CLAIM SZN 1 has ended
        </h3>
        <div className={styles.subline}>
          <span className={styles.subtext}>This is just the beginning ... </span>
        </div>
        <div className={styles.subline}>
          <span className={styles.subtext}>May the odds be ever in your favor anon</span>
          <Image src="/assets/icons/box-black.svg" alt="box" width={24} height={24} />
        </div>
        {/* --- LEFT --- */}
        {/* <div className={styles.left}>
          <div className={styles.leftTitle}>
            <h3>Early Access is Now Closed</h3>
          </div>
          <div className={styles.subline}>
            <Image src="/assets/icons/box-black.svg" alt="box" width={24} height={24} />
            <span className={styles.subtext}>May the odds be ever in your favor anon</span>
          </div>
        </div> */}

        {/* --- RIGHT --- */}
        {/* <div className={styles.right}>
          <div className={styles.input}>
            {!onMobile && (
              <>
                <p>Hello</p>
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Page;
