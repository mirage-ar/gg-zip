"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks";
import * as DateFNS from "date-fns";
import styles from "./Chat.module.css";

import { ChatMessage } from "@/types";
import { GET_MESSAGES_URL, CHAT_SOCKET_URL } from "@/utils/constants";
import { formatWalletAddress } from "@/utils";

const Chat: React.FC = () => {
  const { publicKey, connectWallet } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const webSocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to WebSocket
  useEffect(() => {
    fetchInitialMessages();

    webSocket.current = new WebSocket(CHAT_SOCKET_URL);

    webSocket.current.onmessage = (event: MessageEvent) => {
      const message: ChatMessage = JSON.parse(event.data);

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        return newMessages.slice(-20);
      });
    };

    webSocket.current.onclose = () => {
      console.log("WebSocket Disconnected");
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
        username: publicKey ? formatWalletAddress(publicKey.toBase58()) : "Anonymous",
        image: "https://gg.zip/assets/graphics/koji.png",
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
    resetZoom();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid newline in textarea
      sendMessage();
      resetZoom(); // Assuming you want to keep the resetZoom functionality here as well
    }
  };

  function resetZoom() {
    const viewport = document.querySelector("meta[name=viewport]") as HTMLMetaElement;
    if (viewport) {
      viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0";
      setTimeout(() => {
        viewport.content = "width=device-width, initial-scale=1";
      }, 300);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div key={index} className={styles.chatMessageContainer}>
              <div className={styles.chatMessageInfo}>
                <Image
                  src={message.image}
                  alt={message.username}
                  width={20}
                  height={20}
                  className={styles.chatMessageImage}
                />
                <p className={styles.chatMessageName}>{message.username}</p>
                <p className={styles.chatMessageTimestamp}>
                  {DateFNS.formatDistance(new Date(message.timestamp), new Date(), { addSuffix: true })}
                </p>
              </div>
              <p className={styles.chatMessage}>{message.message}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInputContainer}>
          <textarea
            className={styles.chatInput}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
          {publicKey ? (
            <button onClick={handleFormSubmit} className={styles.chatSendButton}>
              SEND
            </button>
          ) : (
            <button onClick={connectWallet} className={styles.chatSendButton}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
