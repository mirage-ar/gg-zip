"use client";

import React, { useMemo, useEffect } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ApplicationProvider } from "@/state/ApplicationContext";
import GameTimer from "@/components/sponsor/game/GameTimer";
import BoxNotification from "@/components/sponsor/notification/BoxNotification";

import "@solana/wallet-adapter-react-ui/styles.css";

import { RPC } from "@/utils/constants";
import Onboarding from "@/components/onboarding/Onboarding";

export default function Template({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = RPC;

  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <ApplicationProvider>
              {children}
              <Onboarding />
              <GameTimer />
              <BoxNotification />
            </ApplicationProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
