import React from "react";
import Image from "next/image";

import { isMobile } from "@/utils";

import styles from "./page.module.css";
import { on } from "events";

const Page: React.FC = () => {
  const onMobile = isMobile();

  return (
    <div className={styles.main}>
      <h1>About GG</h1>

      {/* PHONE GRAPHICS */}
      <div className={styles.box} style={{ clipPath: "polygon(2% 0, 100% 0, 100% 98%, 98% 100%, 0 100%, 0 2%)" }}>
        <div className={styles.topContainer}>
          <h3>Race, Collect, and win with friends</h3>
          <div className={styles.infoGraphic}>
            <div className={styles.leftGraphic}>
              <Image src="/assets/graphics/about/left.png" alt="graphic icons" width={143} height={200} />
              <p>GG is the world’s first AR crypto game where users race to win SOL</p>
            </div>
            <video className={styles.video} src="/assets/video/about.mp4" muted autoPlay loop />
            {/* <Image src="/assets/graphics/about/phone.svg" alt="graphic icons" width={325} height={661} /> */}
            <div className={styles.rightGraphic}>
              <Image src="/assets/graphics/about/right.png" alt="graphic icons" width={150} height={155} />
              <p>
                Find and collect GBoxes in your city or bet on your friends online, everyone has a chance to win the
                Jackpot
              </p>
            </div>
          </div>
          <Image
            style={{ margin: "52px" }}
            src="/assets/graphics/about/bottom.svg"
            alt="graphic icons"
            width={400}
            height={300}
          />
        </div>
      </div>

      {/* GG MISSION */}
      <div className={styles.box}>
        <div className={styles.boxTitle}>GG Mission</div>
        <div className={styles.boxContent}>
          <p>
            Our mission is to merge crypto, gaming, and augmented reality to create the first ARC (AR Crypto) gaming
            ecosystem on Solana. Community members who join our mission will have the opportunity to earn [REDACTED]
            later this year. The first stage of the airdrop is now LIVE!
          </p>
          <p>
            GG is a gaming studio backed by top crypto-gaming VCs and angels (Delphi Digital, Cozomo de’ Medici, Will
            Price, GMoney, ChiefingZa, Jon Itzler and other crypto-natives).
          </p>
        </div>
      </div>
      {/* <div className={styles.box}>
        <div className={styles.boxTitle}>Invite System</div>
        <div className={styles.boxContent}>
          <h2>GG is invite-only</h2>
          <p>
            We will reward our early players with G. Everyone who joins gets 10 invites to share with friends. You get G
            when you join, when you use an invite, and when someone you invite uses an invite. More G = earlier game
            access! 
          </p>
          <h2>Future Rewards</h2>
          <p>
            In addition to granting you earlier access, getting a higher number of G will entitle you to a greater
            reward of [REDACTED] later this year.
          </p>
        </div>
      </div>
      <>
        <div id="graphic" className={styles.box}>
          <div className={styles.graphicContainer}>
            <>
              <h3 className={styles.title}>
                Invite Friends -&gt; Stack <Image src="/assets/icons/icons-24/g.svg" alt="G" width={30} height={30} />{" "}
                -&gt; Earn [Redacted]
              </h3>
              <div className={styles.graphic}>
                <Image src="/assets/graphics/points-1.svg" alt="graphic icons" width={145} height={40} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/points-2.svg" alt="graphic icons" width={145} height={40} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/points-3.svg" alt="graphic icons" width={145} height={40} />
              </div>
              <div className={styles.description}>
                <p>
                  You have 10 invites.
                  <br />
                  Supercharge your G!
                </p>
                <p>
                  Earn +20% of
                  <br />
                  your friend&apos;s claimed G!
                </p>
                <p>
                  And +10% from
                  <br />
                  their friend&apos;s claimed G!
                </p>
              </div>
            </>
          </div>
        </div>
        <div id="graphic" className={styles.box}>
          <div className={styles.graphicContainer}>
            <>
              <h3 className={styles.title}>
                Boost your <Image src="/assets/icons/icons-24/g.svg" alt="G" width={30} height={30} />
              </h3>
              <div className={styles.graphic}>
                <Image src="/assets/graphics/points-4.svg" alt="graphic icons" width={291} height={40} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
                <div style={{ width: "20px" }} />
                <Image src="/assets/graphics/points-5.svg" alt="graphic icons" width={277} height={40} />
              </div>
              <div className={styles.description}>
                <p>
                  Invite 5 friends and boost your
                  <br />G by x50%!
                </p>
                <p>
                  Get all 10 to join and score
                  <br />a x100% boost!
                </p>
              </div>
            </>
          </div>
        </div>
      </>
      <div id="mobile-graphic" className={styles.box}>
        <h3 className={styles.title}>
          <div>Invite Friends -&gt;</div>
          <div>
            Stack <Image src="/assets/icons/icons-24/g.svg" alt="G" width={30} height={30} /> -&gt;
          </div>
          <div>Earn [Redacted]</div>
        </h3>
        <div className={styles.mobileContent}>
        <Image src="/assets/graphics/points-1.svg" alt="graphic icons" width={200} height={40} />
        <p>You have 10 invites<br />Supercharge your G!</p>
        <Image src="/assets/graphics/about/divider.svg" alt="graphic icons" width={3} height={100} />
        <Image src="/assets/graphics/about/1.svg" alt="graphic icons" width={145} height={40} />
        <p>Earn +2-% of your<br />friend&apos;s claimed G!</p>
        <Image src="/assets/graphics/about/divider.svg" alt="graphic icons" width={3} height={100} />
        <Image src="/assets/graphics/about/2.svg" alt="graphic icons" width={165} height={40} />
        <p>And +10% from<br />their friend&apos;s claimed G!</p>
        </div>
      </div> */}

      <div className={styles.box}>
        <div className={styles.noticeContainer}>
          <h3 className={styles.title} style={{ marginBottom: "32px" }}>
            Notice
          </h3>
          <p className={styles.noticeText}>
            By using the GG app, users confirm they are at least 18 years old. By accessing or using our app, you
            represent and warrant that you meet this age requirement. If you do not meet this requirement, you must not
            access or use GG.
          </p>
          <Image src="/assets/graphics/notice.svg" alt="graphic icons" width={50} height={50} />
        </div>
      </div>
    </div>
  );
};

export default Page;
