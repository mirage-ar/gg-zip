import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { Page, Player, TransactionDetails } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";

interface ApplicationContext {
  transactionDetails: TransactionDetails | null;
  setTransactionDetails: (transactionDetails: TransactionDetails | null) => void;
  closed: boolean;
  setClosed: (closed: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (showOnboarding: boolean) => void;
  page: Page;
  setPage: (page: Page) => void;
  globalUser: Player | null;
  setGlobalUser: (globalUser: Player | null) => void;
  gameEnding: boolean;
  setGameEnding: (gameEnding: boolean) => void;
}

const defaultContext: ApplicationContext = {
  transactionDetails: null,
  setTransactionDetails: () => {},
  closed: false,
  setClosed: () => {},
  showOnboarding: false,
  setShowOnboarding: () => {},
  page: Page.LEADERBOARD,
  setPage: () => {},
  globalUser: null,
  setGlobalUser: () => {},
  gameEnding: false,
  setGameEnding: () => {},
};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [closed, setClosed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [page, setPage] = useState(Page.LEADERBOARD);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

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
    transactionDetails,
    setTransactionDetails,
    closed,
    setClosed,
    showOnboarding,
    setShowOnboarding,
    page,
    setPage,
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
