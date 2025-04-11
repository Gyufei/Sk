"use client";
import { useFullPath } from "@/lib/use-full-path";
import Image from "next/image";
import Link from "next/link";

export function HomeLogo() {
  const pathname = useFullPath();
  const isJuu17Home = pathname === "/";
  const isOneHome = pathname.startsWith("/one");

  if (isJuu17Home) {
    return <div></div>;
  }

  return (
    <Link href="/one" aria-current="page" className="link-block-2 inline-block">
      <Image
        src={isOneHome ? "/icons/logo-one.svg" : "/icons/logo.svg"}
        loading="lazy"
        width={80}
        height={80}
        alt=""
        className="md:absolute md:left-[1.3em] md:top-[1.3em]"
      />
    </Link>
  );
}
