import { GameDate } from "@/types";
import * as DateFNS from "date-fns";

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isMobile() {
  if (typeof window !== "undefined") {
    return /Mobi|Android/i.test(window.navigator.userAgent);
  }
  return false;
}

export function formatPoints(points: number) {
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatWalletAddress(walletAddress: string) {
  return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
}

export function getGameStartTime({ year, month, day }: GameDate) {
  const zeroIndexMonth = month - 1;
  // Create a date object for 12:00 in Eastern Time (UTC-5 or UTC-4)
  const easternTime = new Date(Date.UTC(year, zeroIndexMonth, day, 13, 0, 0));
  // const easternTime = new Date(Date.UTC(year, zeroIndexMonth, day, 3, 0, 0)); // for testing

  return easternTime.getTime(); // Use .getTime() for compatibility
}

export function formatDate(date: Date) {
  return DateFNS.formatDistanceToNow(new Date(date), { addSuffix: true })
    .replace("about ", "")
    .replace("less than a minute ago", "now")
    .replace(" ", "")
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("days", "d")
    .replace("day", "d")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "y")
    .replace("year", "y");
}

export function formatTime(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function createTwitterPostUrl(points: number) {
  const tweetText = `I VOLUNTEER AS TRIBUTE

@ggdotzip is Solana Hunger Games 🏹

I just claimed ${points}🇬 #gg`;

  const encodedTweetText = encodeURIComponent(tweetText);
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

  return twitterIntentUrl;
}

export const withCommas = (x: number | string): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
