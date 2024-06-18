"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks";
import * as DateFNS from "date-fns";
import styles from "./Chat.module.css";

import { ChatMessage } from "@/types";
import { GET_MESSAGES_URL, CHAT_SOCKET_URL } from "@/utils/constants";
import { formatWalletAddress } from "@/utils";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useApplicationContext } from "@/state/ApplicationContext";

const Chat: React.FC = () => {
  const { globalUser: user } = useApplicationContext();

  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
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
      {messages.length > 0 && (
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
                        style={message.source === "sponsor" ? { borderColor: "#FF61EF" } : {}}
                      />
                      <p
                        className={styles.chatMessageName}
                        style={message.source === "sponsor" ? { color: "#FF61EF" } : {}}
                      >
                        {message.username}
                      </p>
                      <Image src={`/assets/icons/icons-16/${message.source === "sponsor" ? "case" : "sword"}.svg`} alt="sponsor case" width={16} height={16} />
                    </div>
                    <p className={styles.chatMessageTimestamp}>
                      {DateFNS.formatDistance(new Date(message.timestamp), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  <p className={styles.chatMessage}>{message.message}</p>
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
              <button onClick={handleFormSubmit} className={styles.chatSendButton}>
                SEND
              </button>
            ) : (
              <button onClick={() => setVisible(true)} className={styles.chatSendButton}>
                Connect Wallet
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
