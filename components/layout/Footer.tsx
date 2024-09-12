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
          <Link className={styles.button} href="https://hunt.gg.zip" target="new">
            Download App
          </Link>
          <Link className={styles.link} href="https://t.me/ggdotzip" target="new">
            <Image src="/assets/icons/telegram.svg" alt="twitter" width={24} height={24} />
          </Link>
          <Link className={styles.link} href="https://twitter.com/ggdotzip" target="new">
            <Image src="/assets/icons/x.svg" alt="twitter" width={24} height={24} />
          </Link>
          <Music />
        </div>
      </footer>

      <div className={styles.copy}>© GG. All rights reserved {new Date().getFullYear()}</div>
    </>
  );
};

export default Footer;
