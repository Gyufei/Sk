import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shorterAddress(
  address: string,
  { startLength, endLength } = {
    startLength: 6,
    endLength: 4,
  },
) {
  if (address.length <= startLength + endLength) {
    return address;
  }

  const startPart = address.substring(0, startLength);
  const endPart = address.substring(address.length - endLength);

  return `${startPart}...${endPart}`;
}

export const twitterPlaceHolderText = "https://x.com/";

export function checkTwitterRegex(x: string) {
  const regex = /^https:\/\/(twitter|x).com\/@?[a-zA-Z0-9_-]{2,15}$/g;
  const allValue = `${twitterPlaceHolderText}${x}`;

  return regex.test(allValue);
}

export function checkEmailRegex(x: string) {
  // const regex =
  //   /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/g;
  const regex =
    /^[a-zA-Z0-9._-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|([a-zA-Z0-9_-]+\.[a-zA-Z]{2,6}))$/g;
  // /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;
  // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

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

export function timestampToTime(timestamp: string) {
  const date = new Date(Number(timestamp)); // 转换为Date对象
  const year = date.getFullYear(); // 获取年份
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // 获取月份，转为两位数
  const day = ("0" + date.getDate()).slice(-2); // 获取日，转为两位数
  const hours = ("0" + date.getHours()).slice(-2); // 获取小时，转为两位数
  const minutes = ("0" + date.getMinutes()).slice(-2); // 获取分钟，转为两位数
  const seconds = ("0" + date.getSeconds()).slice(-2); // 获取秒，转为两位数
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  ); // 拼接日期时间字符串
}

export function getHashParam(key: string) {
  const hash = window.location.hash;
  const hashArr = hash.slice(1).split("=");

  const obj: Record<string, string> = {};
  for (let i = 0; i < hashArr.length; i += 2) {
    obj[hashArr[i]] = hashArr[i + 1];
  }

  return obj[key];
}
