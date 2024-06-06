import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getSession } from "next-auth/react";
import { useApplicationContext } from "@/state/ApplicationContext";
import { Player, TwitterUser } from "@/types";

export default function useUser() {
  const [user, setUser] = useState<Player | null>(null);
  const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const pathname = usePathname();
  const { showOnboarding, setShowOnboarding, setGlobalUser } = useApplicationContext();

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
    } else {
      // do not show onboarding on mint page
      if (pathname !== "/mint") {
        setShowOnboarding(true);
      }
    }
  };

  const createUpdateUser = async (wallet: string, username: string, image: string, twitterId?: string) => {
    try {
      const response = await fetch(`/api/user/${wallet}`, {
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

      setUser({
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: wallet,
        points: data.points,
        boxes: data.boxes,
      });
    } catch (error) {
      console.error("createUpdateUser error:", error);
    }
  };

  const fetchTwitterUserSession = async () => {
    const session = await getSession();
    setTwitterUser(session?.user as TwitterUser);
  };

  useEffect(() => {
    if (!publicKey) return;

    if (pathname === "/mint") {
      fetchTwitterUserSession();
    }

    fetchUser(publicKey.toBase58());
  }, [publicKey, showOnboarding]);

  useEffect(() => {
    setGlobalUser(user);
  }, [user]);

  return { user, twitterUser, publicKey, connectWallet, createUpdateUser };
}
