"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className={styles.container}>
      <div className={styles.logo}>{error}</div>
    </main>
  );
};

export default ErrorPage;
