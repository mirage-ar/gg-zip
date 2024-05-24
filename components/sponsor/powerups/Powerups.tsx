import React, { useEffect, useState } from "react";
import Image from "next/image";
import LiveLeaderboard from "@/components/sponsor/leaderboard/LiveLeaderboard";

import styles from "./Powerups.module.css";

import { Player, SponsorHoldings, Powerup } from "@/types";

interface PowerupsProps {
  flyToMarker: (markerId: string) => void;
  playerList: Player[];
  onlineUsers: string[];
  sponsorHoldings: SponsorHoldings[];
}

const Powerups: React.FC<PowerupsProps> = ({ flyToMarker, playerList, onlineUsers, sponsorHoldings }) => {
  const [selectedPowerup, setSelectedPowerup] = useState<Powerup>(Powerup.KILL);

  let description: React.ReactNode;

  // DESCRIPTION
  switch (selectedPowerup) {
    case Powerup.KILL:
      description = (
        <div className={styles.description}>
          <h4>Kill Shot</h4>
          <p>Half a Hunter&apos;s accumulated &apos;G&apos; by buying out their market cap</p>
        </div>
      );
      break;
    case Powerup.MULTIPLIER:
      description = (
        <div className={styles.description}>
          <h4>Multiplier Boost</h4>
          <p>Purchase multipliers to increase a Hunter&apos;s &apos;G&apos; box earnings</p>
        </div>
      );
      break;
    case Powerup.MAGNETISM:
      description = (
        <div className={styles.description}>
          <h4>Magnetism</h4>
          <p>Enlarge a Hunter&apos;s territory for claiming more Boxes</p>
        </div>
      );
      break;
    default:
      description = (
        <div className={styles.description}>
          <h4>Kill Shot</h4>
          <p>Half a Hunter&apos;s accumulated &apos;G&apos; by buying out their market cap</p>
        </div>
      );
  }

  return (
    <div className={styles.main}>
      {/* ----- POWERUPS CONTAINER ----- */}
      <div className={styles.container}>
        <h5>Choose power-up</h5>
        <div className={styles.powerupList}>
          {Object.values(Powerup).map((powerup) => (
            <div
              key={powerup}
              className={styles.powerup}
              style={powerup === selectedPowerup ? { backgroundColor: "#42FF60" } : {}}
              onClick={() => setSelectedPowerup(powerup)}
            >
              <Image
                src={`/assets/icons/powerups/${powerup}-${powerup === selectedPowerup ? "black" : "white"}.svg`}
                alt={powerup}
                width={24}
                height={24}
              />
            </div>
          ))}
        </div>
        <div className={styles.descriptionContainer}>{description}</div>
      </div>
      <LiveLeaderboard
        flyToMarker={flyToMarker}
        playerList={playerList}
        onlineUsers={onlineUsers}
        sponsorHoldings={sponsorHoldings}
        selectedPowerup={selectedPowerup}
      />
    </div>
  );
};

export default Powerups;
