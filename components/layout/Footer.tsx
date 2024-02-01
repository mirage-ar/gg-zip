import React from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./Footer.module.css";
import Music from "../utility/Music";

const Footer: React.FC = () => {
  return (
    <>
      <footer className={styles.main}>
        <div className={styles.container}>
        <Link className={styles.link} href="https://t.me/ggdotzip" target="_blank">
            <Image src="/assets/icons/telegram.svg" alt="twitter" width={24} height={24} />
            <span style={{ paddingLeft: "6px" }}>GGDOTZIP</span>
          </Link>
          <Link className={styles.link} href="https://twitter.com/ggdotzip" target="_blank">
            <Image src="/assets/icons/x.svg" alt="twitter" width={24} height={24} />
            <span style={{ paddingLeft: "6px" }}>GGDOTZIP</span>
          </Link>
          <Music />
        </div>
      </footer>

      <div className={styles.copy}>© GG. All rights reserved {new Date().getFullYear()}</div>
    </>
  );
};

export default Footer;
