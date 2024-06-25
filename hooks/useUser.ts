import { useApplicationContext } from "@/state/ApplicationContext";
import { Player } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";

export default function useUser() {
  const { publicKey } = useWallet();
  const { setGlobalUser } = useApplicationContext();

  const fetchUser = async (wallet: string): Promise<Player | null> => {
    try {
      const response = await fetch(`/api/user/${wallet}`);
      const result = await response.json();
      if (result.success) {
        const data = result.data;
        return {
          id: data.id,
          username: data.username,
          image: data.image,
          wallet: wallet,
          points: data.points,
          boxes: data.boxes,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching player:", error);
      return null;
    }
  };

  // IMPORTANT - needs to use public key from useWallet
  const createUpdateUser = async (username: string, image: string, twitterId?: string) => {
    try {
      if (!publicKey) {
        throw new Error("CREATE/UPDATE ERROR: no public key found");
      }
      const response = await fetch(`/api/user/${publicKey.toBase58()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          image,
          twitterId,
        }),
      });

      const result = await response.json();
      const data = result.data;

      setGlobalUser({
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: publicKey.toBase58(),
        points: data.points,
        boxes: data.boxes,
      });
    } catch (error) {
      console.error("createUpdateUser error:", error);
    }
  };

  return { fetchUser, createUpdateUser };
}
