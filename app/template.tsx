"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import UserInfo from "@/components/user/UserInfo";

import '@solana/wallet-adapter-react-ui/styles.css';

export default function Template({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = clusterApiUrl(network);

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
            <UserInfo />
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
