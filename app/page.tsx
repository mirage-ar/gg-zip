import Image from "next/image";
import styles from "./page.module.css";
import Timer from "@/components/timer/Timer";
import Link from "next/link";

export default function Home() {
  const launchDate = new Date("2024-03-08T12:00:00Z");
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.leftCard}>
          <div className={styles.topContent}>
            <Image src="/assets/icons/beta.svg" alt="Beta" width={78} height={18} />
            <h1>The Reaping</h1>
            <h2>
              The hunt will begin in NYC march 23rd
              <br />@ NOON Est
            </h2>
            <p>DATE</p>
            <div className={styles.roundedCard}>March 23rd</div>
            <p>LOCATION</p>
            <div className={styles.roundedCard}>TBA</div>
            <p>PRIZE</p>
            <div className={styles.roundedCard}>
              1,000,000
              <Image src="/assets/icons/icons-24/g.svg" alt="Coin" width={24} height={24} />
            </div>
          </div>
          <div className={styles.bottomContent}>
            <div className={styles.bottomCard}>
              <div className={styles.title}>
                <Image src="/assets/icons/icons-16/sword.svg" alt="Arrow" width={20} height={20} />
                Only 25 Hunters will be selected in:
              </div>

              <Timer date={launchDate} />
            </div>
            <div className={styles.tagline}>
              <Image src="/assets/icons/box-black.svg" alt="Arrow" width={20} height={20} />
              May the odds be ever in your favor anon
            </div>
          </div>
        </div>
        <div className={styles.rightCard}>
          <Link className={styles.button} href={"https://6ofx9bdms6c.typeform.com/hunter"}>
            Volunteer as tribute
          </Link>
        </div>
      </div>
    </div>
  );
}
