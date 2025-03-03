"use client";

import React from "react";
import Image from "next/image";

import styles from "./page.module.css";
import Link from "next/link";

export default function HowToPage() {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>How to play</h1>
          </div>

          <div className={styles.section}>
            <h2>
              GG is a live-adventure
              <br />
              trading game
            </h2>

            <div className={styles.longContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />

              <div className={styles.longBlock}>
                <div className={styles.longBlocKTitle}>
                  1h.
                  <Image src="/assets/icons/icons-24/timer.svg" alt="timer" width={24} height={24} />
                </div>
                <p>Game lasts one hour</p>
              </div>

              <Image src="/assets/graphics/howto/vertical.svg" alt="Graphic" width={2} height={74} />

              <div className={styles.longBlock}>
                <div className={styles.longBlocKTitle}>
                  <Image src="/assets/icons/icons-24/hunters2.svg" alt="hunter" width={24} height={24} />
                  OR
                  <Image src="/assets/icons/icons-24/case-green.svg" alt="sponsor" width={24} height={24} />
                </div>
                <p style={{ textAlign: "center" }}>
                  Play as a Hunter (IRL) or
                  <br />
                  Sponsor (online)
                </p>
              </div>

              <Image src="/assets/graphics/howto/vertical.svg" alt="Graphic" width={2} height={74} />

              <div className={styles.longBlock}>
                <div className={styles.longBlocKTitle}>
                  <Image src="/assets/icons/icons-24/g-points.svg" alt="timer" width={24} height={24} />
                </div>
                <p>Stack G to Win the Game</p>
              </div>

              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>

            {/* VIDEO */}
            <div className={styles.video}>
              <video width="941" height="525" controls autoPlay preload="true" poster="/assets/vide/about-cover.gif">
                <source
                  src="https://public-assets-74c056c6-d21c-4e1a-83a5-04eba22798fe.s3.amazonaws.com/about.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.columnContainerWrapper}>
              <div className={styles.columnContainer} style={{ alignItems: "center", gap: "36px" }}>
                <div className={styles.leftTitleContainer}>
                  <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />

                  <div className={styles.leftTitle}>
                    <Image src="/assets/icons/icons-24/case-green.svg" alt="sponsor" width={24} height={24} />
                    <p>Sponsor</p>
                  </div>

                  <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
                </div>

                <Image src="/assets/graphics/howto/sponsor.png" alt="Graphic" width={73} height={236} />
                <div className={styles.subText}>Objective</div>
                <div className={styles.bottomText}>
                  Make as much G and SOL as you can by trading Hunter player cards.
                </div>
              </div>

              <div className={styles.columnContainer}>
                <div className={styles.numberTitle}>1. Join Game</div>
                <div className={styles.text}>
                  <p>
                    Join the game by signing in with your wallet online. You will then have access to the chat, the map,
                    and the trading dashboard.
                  </p>
                </div>

                <div className={styles.numberTitle}>2. Trade Cards</div>
                <div className={styles.text}>
                  <p>
                    The trading dashboard lets you buy and sell Hunters cards with SOL. Trading is available 24/7 and
                    pricing is determined by our bonding curve. It will only be possible to earn G from Hunters while a
                    game is LIVE.
                  </p>
                </div>

                <div className={styles.numberTitle}>3. Earning G + SOL</div>
                <div className={styles.text}>
                  <p>
                    When you own a player card you receive a G kickback everytime your Hunter collects a G box. The more
                    boxes they collect, the more G you receive. G is distributed proportional to the amount of cards you
                    hold. Ex. If you own 10% of a Hunter’s card supply you receive 10% of the G they emit to holders.
                  </p>
                </div>

                <div className={styles.numberTitle}>4. Climb Leaderboard</div>
                <div className={styles.text}>
                  <p>Stack the most G to climb the Sponsor leaderboard and become the GOAT Sponsor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.columnContainerWrapper}>
              <div className={styles.columnContainer} style={{ alignItems: "center", gap: "36px" }}>
                <div className={styles.leftTitleContainer}>
                  <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />

                  <div className={styles.leftTitle}>
                    <Image src="/assets/icons/icons-24/hunters2.svg" alt="sponsor" width={24} height={24} />
                    <p>Hunter</p>
                  </div>

                  <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
                </div>

                <Image src="/assets/graphics/howto/hunter.png" alt="Graphic" width={73} height={236} />
                <div className={styles.subText}>Objective</div>
                <div className={styles.bottomText}>
                  Collect as many G boxes in your area as possible to stack G, and become the GOAT Hunter.
                </div>
              </div>

              <div className={styles.columnContainer}>
                <div className={styles.numberTitle}>1. Mint Card</div>
                <div className={styles.text}>
                  <p>
                    You will need to mint a player card with SOL on our website (
                    <Link href="/mint" style={{ color: "#42FF60" }}>
                      gg.zip/hunter
                    </Link>
                    ) to join The Hunt. This is a one time mint and will give you unlimited chances to play GG. We will
                    connect your wallet address to your Twitter to pay out your potential winnings.
                  </p>
                </div>

                <div className={styles.numberTitle}>2. Join Hunter App</div>
                <div className={styles.text}>
                  <p>
                    Once your player card is ready, download the Hunter webapp and wait for the next game to begin.
                    Hunter cap is 150 people (for now). Remember minting a player card does not guarantee admission for
                    every game - it’s first come first served so be fast.
                  </p>
                </div>

                <div className={styles.numberTitle}>3. Collect Boxes</div>
                <div className={styles.text}>
                  <p>
                    When the game begins, log into GG with your Twitter. No matter where you are we will auto-drop boxes
                    around you. The more friends who join GG in the same place, the more boxes in that area. Different
                    colored boxes have different G values.
                  </p>
                </div>

                <div className={styles.additionalInfo}>
                  <Image src="/assets/graphics/howto/runners.svg" alt="Graphic" width={35} height={35} />
                  <p>We recommend hunting with friends in an open space area (Park. Field, etc.)</p>
                </div>

                <div className={styles.numberTitle}>4. Climb Leaderboard</div>
                <div className={styles.text}>
                  <p>Race Against the World, Stack G, and Win</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.graphicsContainer}>
              <Image
                src="/assets/graphics/howto/sponsor-screen.png"
                alt="Sponsor Graphic"
                width={755}
                height={484}
                style={{ boxShadow: "0 0 20px #42FF60" }}
              />

              <Image
                src="/assets/graphics/howto/hunter-screen.png"
                alt="Sponsor Graphic"
                width={210}
                height={369}
                style={{ marginLeft: "-100px", marginBottom: "-170px" }}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>How long do games last?</h2>
            <div className={styles.infoContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />
              <div className={styles.infoText}>Each game session lasts approximately one hour.</div>
              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>
          </div>

          <div className={styles.section}>
            <h2>What are player cards?</h2>
            <div className={styles.infoContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />
              <div className={styles.infoText}>
                Player cards are digital assets unique to our platform, each representing a Hunter in the game. As a
                Sponsor, purchasing these cards is your way to invest in a Hunter&apos;s in-game success, potentially
                earning from their victories.
              </div>
              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>
          </div>

          <div className={styles.section}>
            <h2>How do Sponsors earn (via Player Cards)?</h2>
            <div className={styles.infoContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />
              <div className={styles.infoText}>
                As a Sponsor, when you own player cards, you earn G whenever the Hunter associated with your cards
                claims a G Box. You get triple the G Box&apos;s value distributed among all cardholders of that Hunter.
              </div>
              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>
          </div>

          <div className={styles.section}>
            <h2>Can I trade my player cards?</h2>
            <div className={styles.infoContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />
              <div className={styles.infoText}>
                Yes! Player card trading is dynamic and occurs along a bonding curve. This means the price of cards
                changes based on supply and demand, allowing you to strategize your trades.
              </div>
              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>
          </div>

          <div className={styles.section}>
            <h2>What happens during the weekly games?</h2>
            <div className={styles.infoContainer}>
              <Image src="/assets/graphics/howto/left-bracket.svg" alt="Graphic" width={14} height={74} />
              <div className={styles.infoText}>
                Each game runs for a fixed duration, typically one hour, once a week. Hunters compete to find and claim
                as many G Boxes as they can.
              </div>
              <Image src="/assets/graphics/howto/right-bracket.svg" alt="Graphic" width={14} height={74} />
            </div>
          </div>

          <div className={styles.noticeContainer}>
            <h3 className={styles.noticeTitle} style={{ marginBottom: "32px" }}>
              Notice
            </h3>
            <p className={styles.noticeText}>
              By using the GG app, users confirm they are at least 18 years old. By accessing or using our app, you
              represent and warrant that you meet this age requirement. If you do not meet this requirement, you must
              not access or use GG.
            </p>
            <Image src="/assets/graphics/notice.svg" alt="graphic icons" width={50} height={50} />
          </div>
        </div>
      </div>
    </>
  );
}
