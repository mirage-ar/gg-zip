import { useEffect, useMemo, useRef, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { GAME_API, COLLECT_SOCKET_URL, PROGRAM_ID } from "@/utils/constants";

import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import IDL from "@/solana/idl.json";

type CollectMessage = {
  id: string;
  username: string;
  image: string;
  wallet: string;
  points: number;
  latitute: number;
  longitude: number;
  timestamp: number;
};

const useCollectSocket = (publicKey: PublicKey | null) => {
  const collectSocket = useRef<WebSocket | null>(null);
  //   const [sponsorPoints, setSponsorPoints] = useState<number>(0);

  const sponsorPointsRef = useRef<number>(0);

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  // TODO: move this to solana utils
  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions());
      const programKey = new PublicKey(PROGRAM_ID);
      // @ts-ignore
      const program = new anchor.Program(IDL, programKey, provider);
      return program;
    }
  }, [connection, anchorWallet]);

  const fetchSponsorPoints = async (wallet: string): Promise<number> => {
    try {
      const response = await fetch(`api/points/${wallet}`);
      const data = await response.json();
      return data.points;
    } catch (error) {
      console.error("Error fetching initial sponsor points:", error);
      return 0;
    }
  };

  const fetchSponsorHoldings = async (wallet: string): Promise<string[]> => {
    if (!program || !publicKey) {
      return [];
    }

    try {
      const ownerFilter = [
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58(),
          },
        },
      ];

      const accounts = await program.account.tokenAccount.all(ownerFilter);
      // @ts-ignore
      const holdings = accounts.map((account) => account.account.subject.toBase58());

      return holdings;
    } catch (error) {
      console.error("Error fetching sponsor holdings:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!publicKey) return;
    const fetchInitalPoints = async () => {
      const initialPoints = await fetchSponsorPoints(publicKey.toBase58());
      sponsorPointsRef.current = initialPoints;
    };
    fetchInitalPoints();
  }, [publicKey]);

  const updateSponsorPoints = async (
    wallet: string,
    message: CollectMessage,
    currentPoints: number
  ): Promise<number> => {
    try {
      // check if sponsor is holding this player card
      const holdings = await fetchSponsorHoldings(wallet);
      const isHolding = holdings.includes(message.wallet);

      if (!isHolding) {
        return currentPoints;
      }

      const response = await fetch(`api/points/sponsor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet: publicKey, subject: message.wallet, points: message.points }),
      });

      const data = await response.json();

      if (!data.success) {
        return currentPoints;
      }

      return data.points;
    } catch (error) {
      console.error("Error updating user points:", error);
      return currentPoints;
    }
  };

  useEffect(() => {
    if (!publicKey) return;

    const connectCollectSocket = () => {
      collectSocket.current = new WebSocket(COLLECT_SOCKET_URL);

      collectSocket.current.onopen = () => {
        console.log("Collect WebSocket Connected");
      };

      collectSocket.current.onmessage = async (event: MessageEvent) => {
        const message: CollectMessage = JSON.parse(event.data);
        console.log("Collect Message", message);
        const points = await updateSponsorPoints(publicKey.toBase58(), message, sponsorPointsRef.current);

        sponsorPointsRef.current = points;
      };

      collectSocket.current.onerror = (error) => {
        console.error("Collect WebSocket Error", error);
      };

      collectSocket.current.onclose = () => {
        console.log("Collect WebSocket Disconnected, attempting to reconnect...");
        // setTimeout(connectCollectSocket, 3000);
      };
    };

    connectCollectSocket();

    return () => {
      collectSocket.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  return { sponsorPoints: sponsorPointsRef.current };
};

export default useCollectSocket;
