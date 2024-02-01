"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./Boost.module.css";

type BoostProps = {
  wallet: string;
};

const Boost: React.FC<BoostProps> = ({ wallet }) => {
  const [boostAmount, setBoostAmount] = useState(0);
  useEffect(() => {
    const fetchBoost = async () => {
      try {
        const res = await fetch(`/api/boost/${wallet}`);
        const { boost } = await res.json();

        setBoostAmount(boost);
      } catch (error: any) {
        throw new Error("Unable to get boost", error);
      }
    };

    fetchBoost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <div>Boost</div>
        <div className={styles.percentageTitle}>
          <span>X 50%</span>
          <Image src="/assets/icons/icons-24/g.svg" alt="g icon" width={24} height={24} />
        </div>
        <div className={styles.percentageTitle}>
          <span>X 100%</span>
          <Image src="/assets/icons/icons-24/g.svg" alt="g icon" width={24} height={24} />
        </div>
      </div>
      <div className={styles.boostContainer}>
        <div className={styles.boostBar} style={boostAmount > 0 ? { backgroundColor: "#23EE43" } : {}} />
        <div className={styles.boostBar} style={boostAmount > 10 ? { backgroundColor: "#23EE43" } : {}} />
        <div className={styles.boostBar} style={boostAmount > 20 ? { backgroundColor: "#23EE43" } : {}} />
        <div className={styles.boostBar} style={boostAmount > 30 ? { backgroundColor: "#23EE43" } : {}} />
        <div className={styles.boostBar} style={boostAmount > 40 ? { backgroundColor: "#23EE43" } : {}} />
        <div
          className={styles.boostBar}
          style={boostAmount > 50 ? { backgroundColor: "#FF61EF", color: "#FF61EF" } : { color: "#FF61EF" }}
        />
        <div
          className={styles.boostBar}
          style={boostAmount > 60 ? { backgroundColor: "#FF61EF", color: "#FF61EF" } : { color: "#FF61EF" }}
        />
        <div
          className={styles.boostBar}
          style={boostAmount > 70 ? { backgroundColor: "#FF61EF", color: "#FF61EF" } : { color: "#FF61EF" }}
        />
        <div
          className={styles.boostBar}
          style={boostAmount > 80 ? { backgroundColor: "#FF61EF", color: "#FF61EF" } : { color: "#FF61EF" }}
        />
        <div
          className={styles.boostBar}
          style={boostAmount > 90 ? { backgroundColor: "#FF61EF", color: "#FF61EF" } : { color: "#FF61EF" }}
        />
      </div>
    </div>
  );
};

export default Boost;
