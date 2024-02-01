"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import UserPoints from "@/components/utility/UserPoints";
import Boost from "@/components/points/Boost";
import Invites from "@/components/points/Invites";
import PointsInfo from "@/components/points/PointsInfo";

import confetti from "canvas-confetti";

import styles from "./page.module.css";

import { User } from "@/types";

const Page: React.FC = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState<boolean>(false);

  // Complex logic to handle redirects
  useEffect(() => {
    if (connected && !user) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${publicKey?.toBase58()}`);
          const data = await res.json();

          if (data.success === false) {
            router.push("/");
          } else {
            setUser(data);
          }
        } catch (error: any) {
          throw new Error("Unable to get user", error);
        }
      };

      fetchUser();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // ONBOARDING
  useEffect(() => {
    // Check if the user has already visited
    if (localStorage.getItem("onboarded")) {
      setOnboarded(true);
    }
  }, []);

  const handleOnboarded = () => {
    setOnboarded(true);
    localStorage.setItem("onboarded", "true");
  }

  return (
    <div className={styles.main}>
      {user && (
        <>
          <UserPoints points={user?.points || 0} />
          <div className={styles.divider} />
          {!onboarded && <PointsInfo handleOnboarded={handleOnboarded} />}
          <Boost wallet={publicKey?.toBase58() || ""} />
          <Invites wallet={publicKey?.toBase58() || ""} />
        </>
      )}
    </div>
  );
};

export default Page;
