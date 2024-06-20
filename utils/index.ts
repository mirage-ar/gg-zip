import { GameDate } from "@/types";
import { GAME_TIME } from "./constants";
import * as DateFNS from "date-fns";

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPoints(points: number) {
  return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatWalletAddress(walletAddress: string) {
  return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
}

export function getGameStartTime({ year, month, day }: GameDate) {
  const zeroIndexMonth = month - 1;
  const easternTime = new Date(Date.UTC(year, zeroIndexMonth, day, GAME_TIME + 4, 0, 0));
  return easternTime.getTime();
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
  if (typeof x === "number" && x < 1) {
    return x.toString();
  }

  if (typeof x === "string" && Number(x) < 1) {
    return x.toString();
  }

  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const abbreviateString = (str: string, maxLength: number = 10): string => {
  if (str.length <= maxLength) {
    return str;
  }

  return str.slice(0, maxLength - 3) + "...";
}


export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;

      // Calculate the crop dimensions
      let cropX = 0;
      let cropY = 0;
      let cropSize = Math.min(width, height);

      if (width > height) {
        cropX = (width - height) / 2;
      } else {
        cropY = (height - width) / 2;
      }

      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;
      const ctx = canvas.getContext("2d");

      // Draw the cropped and resized image on the canvas
      ctx?.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, MAX_SIZE, MAX_SIZE);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.src = URL.createObjectURL(file);
  });
};