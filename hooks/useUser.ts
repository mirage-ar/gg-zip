import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Player } from "@/types";
import { set } from "date-fns";

export default function useUser() {
  const [user, setUser] = useState<Player | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const connectWallet = async () => {
    if (!publicKey) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    const fetchUser = async () => {
      // CHECK IF USER EXISTS
      const response = await fetch(`/api/user/${publicKey.toBase58()}`);
      const result = await response.json();
      if (result.success) {
        const data = result.data;
        setUser({
          id: data.id,
          username: data.username,
          image: data.image,
          wallet: publicKey.toBase58(),
          points: data.points,
          boxes: data.boxes,
        });
        setPoints(data.points);
      } else {
        // TODO: 1) SHOW USERNAME + IMAGE POPOVER

        // CREATE USER
        const response = await fetch(`/api/user/${publicKey.toBase58()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "user_" + new Date().getTime(), // will be replaced with provided username
            image: "https://gg.zip/assets/graphics/koji.png",
          }),
        });

        const result = await response.json();
        const data = result.data;

        if (data.id) {
          setUser({
            id: data.id,
            username: data.username,
            image: data.image,
            wallet: publicKey.toBase58(),
            points: data.points,
            boxes: data.boxes,
          });
          setPoints(data.points);
        }
      }
    };

    fetchUser();
  }, [publicKey]);

  return { user, points, connectWallet, publicKey };
}
