import BN from "bn.js";
import { rand } from "@/utils";

function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / 1000000000;
}

export function getPrice(supply: bigint, amount: bigint): number {
  const LAMPORTS_PER_SOL = 1000000000n; // Update this as necessary
  const factor = 1600n;

  let sum1: bigint = 0n;
  if (supply !== 0n) {
    sum1 = ((supply - 1n) * supply * (2n * (supply - 1n) + 1n)) / 6n;
  }

  let sum2: bigint = 0n;
  if (!(supply === 0n && amount === 1n)) {
    sum2 = ((supply - 1n + amount) * (supply + amount) * (2n * (supply - 1n + amount) + 1n)) / 6n;
  }

  let summation = sum2 - sum1;
  return lamportsToSol((summation * LAMPORTS_PER_SOL) / factor);
}

export function getBuyPrice(sharesSupply: number, amount: number): number {
  const price = getPrice(BigInt(sharesSupply), BigInt(amount));
  return Number((price + price * 0.1).toFixed(3));
}

export function getSellPrice(sharesSupply: number, amount: number): number {
  const price = getPrice(BigInt(sharesSupply) - BigInt(amount), BigInt(amount));
  return Number((price - price * 0.1).toFixed(3)); // include fees
}

export function bnToNumber(bn: BN): number {
  if (bn.lt(new BN(Number.MIN_SAFE_INTEGER)) || bn.gt(new BN(Number.MAX_SAFE_INTEGER))) {
    console.error("Number out of range for JavaScript Number type");
    return 0; // or handle the error as you see fit
  }
  return bn.toNumber();
}

export const numberToBigInt = (num: number): bigint => BigInt(num);
