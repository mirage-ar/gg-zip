import React, { useEffect, useState } from "react";
import Image from "next/image";

import styles from "./Invites.module.css";

import { Invite } from "@/types";
import { formatPoints, rand } from "@/utils";

interface InvitesProps {
  wallet: string;
}

const Invites: React.FC<InvitesProps> = ({ wallet }) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Fetch invites
    const fetchInvites = async () => {
      try {
        const res = await fetch(`/api/invites/${wallet}`);
        const data = await res.json();

        setInvites(data);
      } catch (error: any) {
        throw new Error("Unable to get invites", error);
      }
    };

    fetchInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyText = (text: string, id: string) => () => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  return (
    <div className={styles.main}>
      <h3>You Have {invites.length} invites</h3>
      <div className={styles.invitesContainer}>
        {invites.map((invite) => (
          <div key={invite.id}>
            {!invite.claimed ? (
              <div className={styles.inviteCode}>
                <div className={styles.inviteCodeText}>
                  <div className={styles.inviteCodeIcon}>
                    <Image src={`/assets/icons/icons-16/user-${rand(1, 5)}.svg`} alt="lil guy" width={16} height={16} />
                  </div>
                  gg.zip/{invite.code}
                </div>
                <button
                  className={styles.inviteCodeCopy}
                  onClick={copyText(`https://gg.zip/${invite.code}`, invite.id)}
                >
                  {copied == invite.id ? "Copied" : "Copy"}
                  <Image src="/assets/icons/icons-16/copy.svg" alt="copy" width={16} height={16} />
                </button>
              </div>
            ) : (
              <div className={styles.inviteClaimedContainer} key={invite.id}>
                <div className={styles.inviteCode} style={{ backgroundColor: "#000" }}>
                  <div className={styles.inviteCodeUser}>
                    <div className={styles.inviteCodeUserIcon}>
                      <Image
                        src={invite.claimedImage || `/assets/icons/icons-16/user-${rand(1, 5)}.svg`}
                        alt="lil guy"
                        width={24}
                        height={24}
                      />
                    </div>
                    {invite.claimedUsername}
                  </div>
                  <div className={styles.inviteCodeClaimed}>
                    <div className={styles.inviteCodeClaimedText}>+{formatPoints(invite.claimedPoints || 0)}</div>
                    <Image src="/assets/icons/icons-24/g.svg" alt="g icon" width={24} height={24} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invites;
