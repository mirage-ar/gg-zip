"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import styles from "./Navigation.module.css";
import { it } from "node:test";

const Navigation: React.FC = () => {
  const pathName = usePathname();
  const url = pathName.split("/")[1];

  const [active, setActive] = useState<number | null>(0);

  const items = useMemo(() => [
    { id: 0, name: "sponsor", path: "/" },
    { id: 1, name: "hunter", path: "/mint" },
    { id: 2, name: "leaderboard", path: "/leaderboard" },
    { id: 3, name: "how to play", path: "/aboutgg" },
  ], []);

  useEffect(() => {
    items.forEach((item) => {
      if (url.includes(item.name)) {
        setActive(item.id);
      } else if (url.includes("claimdrop") || url.includes("analyze")) {
        setActive(0);
      }
    });
  }, [items, url]);

  return (
    <nav className={styles.main}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/assets/icons/logo-animated.gif" alt="logo" priority width={160} height={160} />
        </Link>
      </div>
      <ul className={styles.list}>
        {items.map((item) => (
          <Link key={item.id} onClick={(e) => setActive(item.id)} href={`${item.path}`}>
            <li id={item.name} style={{ paddingBottom: "6px" }} className={item.id == active ? styles.active : ""}>
              {item.name}
            </li>
          </Link>
        ))}
      </ul>

      <div className={styles.mobileNav}>
        {items.map(
          (item) =>
            item.name != "hunt" && (
              <Link key={item.id} onClick={(e) => setActive(item.id)} href={`${item.path}`}>
                {item.name}
              </Link>
            )
        )}
      </div>
    </nav>
  );
};

export default Navigation;
