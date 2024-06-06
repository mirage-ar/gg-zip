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

  const [points, setPoints] = useState<number | null>(null);

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const pathname = usePathname();
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
      // do not show onboarding on mint page
      if (pathname !== "/mint") {
        setShowOnboarding(true);
      }
    }
  };

  const updateUserData = async (wallet: string, username: string, image: string) => {
    const response = await fetch(`/api/user/${wallet}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        image,
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

  return { user, twitterUser, points, connectWallet, publicKey, updateUserData };
}
