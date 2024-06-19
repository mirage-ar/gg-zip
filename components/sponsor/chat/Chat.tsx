"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks";
import * as DateFNS from "date-fns";
import styles from "./Chat.module.css";

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

const Chat: React.FC<ChatProps> = ({ playerList }) => {
  const { globalUser: user } = useApplicationContext();

  const { fetchUser } = useUser();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { program } = useSolana();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages.slice(-500);
      });
    };

    return () => {
      webSocket.current?.close();
    };
  }, []);

  // Connect to Transaction WebSocket
  useEffect(() => {
    if (!program) return;
    if (playerList.length === 0) return;

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const programId = program.programId;
    const programPublicKey = new PublicKey(programId);

    const subscriptionId = connection.onLogs(
      programPublicKey,
      async (logs) => {
        const transactionResponse = await connection.getParsedTransaction(logs.signature);
        const transactionLogs = transactionResponse?.meta?.logMessages?.filter((message) =>
          message.includes("Program log")
        );

        if (transactionLogs && transactionLogs[0]?.includes("Shares")) {
          const firstLog = transactionLogs[0];
          const transactiontype = firstLog
            .substring(firstLog.indexOf("Shares") - 4, firstLog.indexOf("Shares"))
            .replace(" ", "");

          const transaction: TransactionData = {
            type: transactiontype,
            amount: transactionLogs[1]?.substring(transactionLogs[1].indexOf("price: ") + 7),
            subject: transactionLogs[2]?.substring(transactionLogs[2].indexOf("subject: ") + 9),
            buyer: transactionLogs[3]?.substring(transactionLogs[3].indexOf("buyer: ") + 7),
            timestamp: Number(transactionLogs[4]?.substring(transactionLogs[4].indexOf("timestamp: ") + 11)),
            signature: transactionResponse?.transaction.signatures[0] || "",
          };

          // fetch user from db here
          const buyer = await fetchUser(transaction.buyer);
          const subject = playerList.find((player) => player.wallet === transaction.subject);

          if (buyer) {
            setMessages((prevMessages) => {
              const transactionMessage: ChatMessage = {
                message: `${
                  transaction.type === "Buy" ? "Bought" : "Sold"
                } @${subject?.username.toLocaleUpperCase()} for ${Number(transaction.amount).toFixed(3)}`,
                timestamp: transaction.timestamp * 1000,
                username: buyer.username,
                image: buyer.image,
                source: "system",
              };

              const newMessages = [...prevMessages, transactionMessage];
              return newMessages.slice(-500);
            });
          }

          // get user from db here
        }
      },
      "confirmed"
    );

    return () => {
      connection.removeOnLogsListener(subscriptionId);
    };
  }, [program, playerList]);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const sendMessage = () => {
    if (inputMessage !== "" && webSocket.current) {
      const messageData: ChatMessage = {
        message: inputMessage,
        timestamp: Date.now(),
        username: user?.username || (publicKey && formatWalletAddress(publicKey.toBase58())) || "Anonymous",
        image: user?.image || "https://gg.zip/assets/graphics/koji.png",
        source: "sponsor",
      };
      webSocket.current.send(JSON.stringify({ action: "sendmessage", data: messageData }));
      setInputMessage("");
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div key={index} className={styles.chatMessageContainer}>
              <div className={styles.chatMessageInfo}>
                <div className={styles.chatMessageImageContainer}>
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
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.chatInputContainer}>
        <textarea
          className={styles.chatInput}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Send a message..."
        />
        {publicKey ? (
          <button onClick={handleFormSubmit} className={styles.chatSendButton} style={{justifyContent: "flex-end", paddingRight: "16px"}}>
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
  );
};

export default Chat;
