import { useState, useEffect, useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";

import IDL from "@/solana/idl.json";
import { PROGRAM_KEY } from "@/solana/constants";

export default function useProgram() {
  // TODO: should rename
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      // @ts-ignore
      const program = new anchor.Program(IDL, PROGRAM_KEY, provider);
      return program;
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    // Add your logic here
    // This effect will run on component mount and whenever the dependencies change

    return () => {
      // Clean up any resources or subscriptions here
    };
  }, []);

  return {program};
}
