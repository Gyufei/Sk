import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorterAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const twitterPlaceHolderText = "https://x.com/";

export function checkTwitterRegex(x: string) {
  const regex = /^https:\/\/(twitter|x).com\/@?[a-zA-Z0-9_-]{2,15}$/g;
  const allValue = `${twitterPlaceHolderText}${x}`;

  return regex.test(allValue);
}

export function checkEmailRegex(x: string) {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

  return regex.test(x);
}

export function checkDiscordRegex(x: string) {
  const regex = /^@?[a-zA-Z0-9_-]{5,40}$/g;

  return regex.test(x);
}

export function checkTgRegex(x: string) {
  const regex = /^@?[a-zA-Z0-9_]{5,32}$/g;

  return regex.test(x);
}

export const githubPlaceHolderText = "https://github.com/";
export function checkGithubRegex(x: string) {
  const regex = /^https:\/\/github.com\/[a-zA-Z0-9_-]{1,40}$/g;
  const allValue = `${githubPlaceHolderText}${x}`;

  return regex.test(allValue);
}

// 2024-09-23T17:39:47.932Z  => 2024-4-1 23:11:11
export function formatDate(isoString: string) {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  const min = minute < 10 ? `0${minute}` : minute;
  const sec = second < 10 ? `0${second}` : second;

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}
