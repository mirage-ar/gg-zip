"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Image from "next/image";

import styles from "./Music.module.css";

const Music: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play();
        document.removeEventListener("click", playAudio);
      }
    };

    document.addEventListener("click", playAudio);

    return () => {
      document.removeEventListener("click", playAudio);
    };
  }, []);

  return (
    <div className={styles.main}>
      <audio ref={audioRef} src={"/assets/audio/music.mp3"} autoPlay loop muted={isMuted} />
      <div className={styles.button} onClick={toggleMute}>
        <Image
          src={isMuted ? "/assets/icons/icons-24/sound-off.svg" : "/assets/icons/icons-24/sound-on.svg"}
          alt="mute button"
          width={24}
          height={24}
        />
        Music
      </div>
    </div>
  );
};

export default Music;
