"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks";
import * as DateFNS from "date-fns";
import styles from "./Chat.module.css";

import TradingView from "@/components/sponsor/trade/TradingView";

import { ChatMessage, Player, TransactionData } from "@/types";
import { GET_MESSAGES_URL, CHAT_SOCKET_URL, RPC } from "@/utils/constants";
import { formatWalletAddress } from "@/utils";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useApplicationContext } from "@/state/ApplicationContext";
import { Connection, PublicKey } from "@solana/web3.js";
import useSolana from "@/hooks/useSolana";

interface ChatProps {
  playerList: Player[];
}

enum MessageType {
  USER = "user",
  TRANSACTION = "transaction",
}

const Chat: React.FC<ChatProps> = ({ playerList }) => {
  const { fetchUser } = useUser();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { program } = useSolana();

  const { setShowOnboarding } = useApplicationContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState<boolean>(false);
  const closedRef = useRef<boolean>(closed);
  const messageCount = useRef<number>(0);

  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [tradingViewPlayer, setTradingViewPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!closed) {
      messageCount.current = 0;
    }

    closedRef.current = closed;
  }, [closed]);

  // Connect to Chat WebSocket
  useEffect(() => {
    fetchInitialMessages();

    webSocket.current = new WebSocket(CHAT_SOCKET_URL);

    webSocket.current.onopen = () => {
      console.log("Chat WebSocket connected");
    };

    webSocket.current.onerror = (error: Event) => {
      console.error("Chat WebSocket error:", error);
    };

    webSocket.current.onmessage = (event: MessageEvent) => {
      const message: ChatMessage = JSON.parse(event.data);

      if (closedRef.current) {
        messageCount.current += 1;
      }

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages.slice(-500);
      });
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  // TODO: remove transactions
  // TRANSACTIONS
  // Connect to Transaction WebSocket
  // useEffect(() => {
  //   if (!program) return;
  //   if (playerList.length === 0) return;

  //   const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  //   const programId = program.programId;
  //   const programPublicKey = new PublicKey(programId);

  //   const subscriptionId = connection.onLogs(
  //     programPublicKey,
  //     async (logs) => {
  //       const transactionResponse = await connection.getParsedTransaction(logs.signature);
  //       const transactionLogs = transactionResponse?.meta?.logMessages?.filter((message) =>
  //         message.includes("Program log")
  //       );

  //       if (transactionLogs && transactionLogs[0]?.includes("Shares")) {
  //         const firstLog = transactionLogs[0];
  //         const transactiontype = firstLog
  //           .substring(firstLog.indexOf("Shares") - 4, firstLog.indexOf("Shares"))
  //           .replace(" ", "");

  //         const transaction: TransactionData = {
  //           type: transactiontype,
  //           amount: transactionLogs[1]?.substring(transactionLogs[1].indexOf("price: ") + 7),
  //           subject: transactionLogs[2]?.substring(transactionLogs[2].indexOf("subject: ") + 9),
  //           buyer: transactionLogs[3]?.substring(transactionLogs[3].indexOf("buyer: ") + 7),
  //           timestamp: Number(transactionLogs[4]?.substring(transactionLogs[4].indexOf("timestamp: ") + 11)),
  //           signature: transactionResponse?.transaction.signatures[0] || "",
  //         };

  //         // fetch user from db here
  //         const buyer = await fetchUser(transaction.buyer);
  //         const subject = playerList.find((player) => player.wallet === transaction.subject);

  //         if (buyer && subject) {
  //           setMessages((prevMessages) => {
  //             const transactionMessage: ChatMessage = {
  //               message: `${buyer.username.toLocaleUpperCase()} ${
  //                 transaction.type === "Buy" ? "bought" : "sold"
  //               } ${subject.username.toLocaleUpperCase()} for ${Number(transaction.amount).toFixed(3)} Sol`,
  //               timestamp: transaction.timestamp * 1000,
  //               username: subject.username,
  //               image: subject.image,
  //               source: "system",
  //               type: MessageType.TRANSACTION,
  //             };

  //             const newMessages = [...prevMessages, transactionMessage];
  //             return newMessages.slice(-500);
  //           });
  //         }
  //       }
  //     },
  //     "confirmed"
  //   );

  //   return () => {
  //     connection.removeOnLogsListener(subscriptionId);
  //   };
  // }, [program, playerList]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = async () => {
    const user = await fetchUser(publicKey?.toBase58() || "");
    if (inputMessage !== "" && webSocket.current && user) {
      const messageData: ChatMessage = {
        message: inputMessage,
        timestamp: Date.now(),
        username: user.username,
        image: user.image,
        source: "sponsor",
        type: MessageType.USER,
      };
      webSocket.current.send(JSON.stringify({ action: "sendmessage", data: messageData }));
      setInputMessage("");
    } else {
      console.error("Failed to send message: User not found.");
    }
  };

  // Fetch initial messages
  const fetchInitialMessages = async () => {
    try {
      const response = await fetch(GET_MESSAGES_URL);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setMessages(data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch initial messages:", error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid newline in textarea
      sendMessage();
    }
  };

  const showTradingView = (username: string) => {
    const player = playerList.find((player) => player.username === username);
    if (player) {
      setTradingViewPlayer(player);
      setShowOverlay(true);
    }
  };

  const chatMessage = (message: ChatMessage, index: number) => {
    if (message.type === MessageType.TRANSACTION) {
      return (
        <div
          key={index}
          className={styles.transactionMessageContainer}
          onClick={() => showTradingView(message.username)}
        >
          <div className={styles.transactionMessageInfo}>{message.message}</div>
        </div>
      );
    }

    return (
      <div key={index} className={styles.chatMessageContainer}>
        <div className={styles.chatMessageInfo}>
          <div className={`${styles.chatMessageImageContainer} ${playerList.find((player) => player.username === message.username) ? styles.clickable : {}}`} onClick={() => showTradingView(message.username)}>
            <Image
              src={message.image}
              alt={message.username}
              width={20}
              height={20}
              className={styles.chatMessageImage}
              style={message.source === "hunter" ? { borderColor: "#42FF60" } : {}}
            />
            <p className={styles.chatMessageName} style={message.source === "hunter" ? { color: "#42FF60" } : {}}>
              {message.username}
            </p>
            <Image
              src={`/assets/icons/icons-16/${message.source === "hunter" ? "sword" : "case"}.svg`}
              alt="sponsor case"
              width={16}
              height={16}
            />
          </div>
          <p className={styles.chatMessageTimestamp}>
            {DateFNS.formatDistance(new Date(message.timestamp), new Date(), { addSuffix: true })}
          </p>
        </div>
        <p className={styles.chatMessage} style={message.source === "system" ? { color: "#FF61EF" } : {}}>
          {message.message}
        </p>
      </div>
    );
  };

  return (
    <>
      {showOverlay && tradingViewPlayer && <TradingView player={tradingViewPlayer} setShowOverlay={setShowOverlay} />}
      <button onClick={() => setClosed(!closed)} className={styles.chatCloseButton}>
        <Image src={`/assets/icons/icons-16/${closed ? "open" : "close"}.svg`} alt="close" width={16} height={16} />
        Chat
      </button>

      <>
        <div className={styles.container} style={closed ? { marginBottom: "-1000px" } : { marginBottom: "0px" }}>
          <div className={styles.chatMessages}>
            {messages.map((message, index) => chatMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div
          className={styles.chatInputContainer}
          style={closed ? { marginBottom: "-1000px" } : { marginBottom: "0px" }}
        >
          <textarea
            className={styles.chatInput}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Send a message..."
          />
          {publicKey ? (
            <button
              onClick={handleFormSubmit}
              className={styles.chatSendButton}
              style={{ justifyContent: "flex-end", paddingRight: "16px" }}
            >
              <Image src="/assets/icons/icons-24/send.svg" alt="send message" width={24} height={24} />
            </button>
          ) : (
            <button onClick={() => setVisible(true)} className={styles.chatSendButton}>
              Connect
              <Image src="/assets/icons/icons-24/plus.svg" alt="connect wallet" width={24} height={24} />
            </button>
          )}
        </div>
      </>

      {messages.length > 0 && (
        <div className={styles.closedAnimation} style={!closed ? { marginBottom: "-200px" } : { marginBottom: "0px" }}>
          {messageCount.current > 0 && <div className={styles.messageCount}>{messageCount.current}</div>}
          <div className={styles.closedContainer}>{chatMessage(messages[messages.length - 1], 0)}</div>
        </div>
      )}
    </>
  );
};

export default Chat;
