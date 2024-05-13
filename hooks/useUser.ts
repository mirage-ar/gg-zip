import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function useUser() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const connectWallet = async () => {
    try {
      if (!publicKey) {
        setVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { connectWallet, publicKey };
}
