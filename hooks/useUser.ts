import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useApplicationContext } from "@/state/context";
import { Player } from "@/types";

export default function useUser() {
  const [user, setUser] = useState<Player | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const { showOnboarding, setShowOnboarding } = useApplicationContext();

  const connectWallet = async () => {
    if (!publicKey) {
      setVisible(true);
    }
  };

  const fetchUser = async (wallet: string) => {
    // CHECK IF USER EXISTS
    const response = await fetch(`/api/user/${wallet}`);
    const result = await response.json();
    if (result.success) {
      const data = result.data;
      setUser({
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: wallet,
        points: data.points,
        boxes: data.boxes,
      });
      setPoints(data.points);
    } else {
      console.log("here");
      setShowOnboarding(true);
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    fetchUser(publicKey.toBase58());
  }, [publicKey, showOnboarding]);

  return { user, points, connectWallet, publicKey };
}
