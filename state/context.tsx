import React, { useState } from "react";
import { createContext, useContext } from "react";

interface ApplicationContext {
  transactionPending: boolean;
  setTransactionPending: (transactionPending: boolean) => void;
}

const defaultContext: ApplicationContext = {
  transactionPending: false,
  setTransactionPending: () => {},
};

const Context = createContext(defaultContext);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [transactionPending, setTransactionPending] = useState<boolean>(false);

  const value: ApplicationContext = {
    transactionPending,
    setTransactionPending,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApplicationContext() {
  return useContext(Context);
}
