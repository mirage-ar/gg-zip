import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { Player } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";

interface ApplicationContext {
  transactionPending: boolean;
  setTransactionPending: (transactionPending: boolean) => void;
  closed: boolean;
  setClosed: (closed: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (showOnboarding: boolean) => void;
  globalUser: Player | null;
  setGlobalUser: (globalUser: Player | null) => void;
  gameEnding: boolean;
  setGameEnding: (gameEnding: boolean) => void;
}

const defaultContext: ApplicationContext = {
  transactionPending: false,
  setTransactionPending: () => {},
  closed: false,
  setClosed: () => {},
  showOnboarding: false,
  setShowOnboarding: () => {},
  globalUser: null,
  setGlobalUser: () => {},
  gameEnding: false,
  setGameEnding: () => {},
};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [transactionPending, setTransactionPending] = useState<boolean>(false);
  const [closed, setClosed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // IMPORTANT: global user is used to sync user info and sponsor navigation // onboarding
  const [globalUser, setGlobalUser] = useState<Player | null>(null);
  const [gameEnding, setGameEnding] = useState(false);

  const pathname = usePathname();

  const { publicKey } = useWallet();

  const fetchUser = async (wallet: string) => {
    console.log("fetchUser", wallet);
    // CHECK IF USER EXISTS
    const response = await fetch(`/api/user/${wallet}`);
    const result = await response.json();
    if (result.success) {
      const data = result.data;
      setGlobalUser({
        id: data.id,
        username: data.username,
        image: data.image,
        wallet: wallet,
        points: data.points,
        boxes: data.boxes,
      });
      setShowOnboarding(false);
    } else {
      setGlobalUser(null);
      // do not show onboarding on mint page
      if (pathname !== "/mint") {
        setShowOnboarding(true);
      }
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchUser(publicKey.toBase58());
    }
  }, [publicKey]);

  const value: ApplicationContext = {
    transactionPending,
    setTransactionPending,
    closed,
    setClosed,
    showOnboarding,
    setShowOnboarding,
    globalUser,
    setGlobalUser,
    gameEnding,
    setGameEnding,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApplicationContext() {
  return useContext(Context);
}
