import React from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import styles from "./ConnectWallet.module.css";

const ConnectWallet: React.FC = () => {
  const { setVisible } = useWalletModal();

  const handleConnectWallet = async () => {
    try {
      setVisible(true);
    } catch (error: any) {
      throw new Error("Unable to connect wallet", error);
    }
  };

  return (
    <div className={styles.button} onClick={handleConnectWallet}>
      Connect Wallet
    </div>
  );
};

export default ConnectWallet;
