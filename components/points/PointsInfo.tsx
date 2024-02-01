import React from "react";
import Image from "next/image";

import styles from "./PointsInfo.module.css";

interface ClaimInfoProps {
  handleOnboarded: () => void;
}

const ClaimInfo: React.FC<ClaimInfoProps> = ({ handleOnboarded }) => {
  const [step, setStep] = React.useState<number>(0);

  const handledProgress = () => {
    if (step === 0) {
      setStep(1);
    } else {
      handleOnboarded();
    }
  };

  return (
    <div className={styles.main}>
      {step === 0 ? (
        <>
          <h3 className={styles.title}>Invite Friends -&gt; Stack <Image src="/assets/icons/icons-24/g.svg" alt="G" width={30} height={30} /> -&gt; Earn [Redacted]</h3>
          <div className={styles.graphic}>
            <Image src="/assets/graphics/points-1.svg" alt="graphic icons" width={145} height={40} />
            <div style={{width: "20px"}} />
            <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
            <div style={{width: "20px"}} />
            <Image src="/assets/graphics/points-2.svg" alt="graphic icons" width={145} height={40} />
            <div style={{width: "20px"}} />
            <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
            <div style={{width: "20px"}} />
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
      ) : (
        <>
          <h3 className={styles.title}>Boost your <Image src="/assets/icons/icons-24/g.svg" alt="G" width={30} height={30} /></h3>
          <div className={styles.graphic}>
            <Image src="/assets/graphics/points-4.svg" alt="graphic icons" width={291} height={40} />
            <div style={{width: "20px"}} />
            <Image src="/assets/graphics/spacer.svg" alt="graphic icons" width={134} height={2} />
            <div style={{width: "20px"}} />
            <Image src="/assets/graphics/points-5.svg" alt="graphic icons" width={277} height={40} />
          </div>
          <div className={styles.secondDescription}>
            <p>
            Invite 5 friends and boost your<br />G by x50%!
            </p>
            <p>
            Get all 10 to join and score<br />a x100% boost!
            </p>
          </div>
        </>
      )}
      <button className={styles.button} onClick={handledProgress}>
        {step === 0 ? "Next" : "Close"}
      </button>
      <div className={styles.progress}>
        <div className={styles.progressIcon} style={step == 0 ? { color: "#42FF60" } : {}}>
          •
        </div>
        <div className={styles.progressIcon} style={step == 1 ? { color: "#42FF60" } : {}}>
          •
        </div>
      </div>
    </div>
  );
};

export default ClaimInfo;
