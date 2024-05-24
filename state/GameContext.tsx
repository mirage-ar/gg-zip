import React, { useState } from "react";
import { createContext, useContext } from "react";
import { BoxNotification, Player, SponsorHoldings } from "@/types";

interface GameContext {

}

const defaultContext: GameContext = {

};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
    const [playerList, setPlayerList] = useState<Player[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [sponsorHoldings, setSponsorHoldings] = useState<SponsorHoldings[]>([]);

  const value: GameContext = {

  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApplicationContext() {
  return useContext(Context);
}
