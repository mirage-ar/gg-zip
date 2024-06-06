import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { BoxNotification, Player } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";

interface ApplicationContext {
  transactionPending: boolean;
  setTransactionPending: (transactionPending: boolean) => void;
  closed: boolean;
  setClosed: (closed: boolean) => void;
  boxNotification: BoxNotification;
  setBoxNotification: (boxNotification: BoxNotification) => void;
  showOnboarding: boolean;
  setShowOnboarding: (showOnboarding: boolean) => void;
  globalUser: Player | null;
  setGlobalUser: (globalUser: Player | null) => void;
}

const defaultContext: ApplicationContext = {
  transactionPending: false,
  setTransactionPending: () => {},
  closed: false,
  setClosed: () => {},
  boxNotification: { player: null, points: 0, show: false },
  setBoxNotification: () => {},
  showOnboarding: false,
  setShowOnboarding: () => {},
  globalUser: null,
  setGlobalUser: () => {},
};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [transactionPending, setTransactionPending] = useState<boolean>(false);
  const [closed, setClosed] = useState(false);
  const [boxNotification, setBoxNotification] = useState<BoxNotification>({ player: null, points: 0, show: false });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [globalUser, setGlobalUser] = useState<Player | null>(null);

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
    boxNotification,
    setBoxNotification,
    showOnboarding,
    setShowOnboarding,
    globalUser,
    setGlobalUser,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApplicationContext() {
  return useContext(Context);
}
