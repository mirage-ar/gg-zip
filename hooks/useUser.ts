import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { User } from "@/types";

export default function useUser() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const connectWallet = async () => {
    try {
      setVisible(true);
    } catch (error) {
      console.error(error);
    }
  }

  return {connectWallet, publicKey};
}
