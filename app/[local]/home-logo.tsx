"use client";
import Image from "next/image";
import { isProduction } from "@/lib/api/path";
import { useFullPath } from "@/lib/use-full-path";
import { Link } from "@/app/navigation";

export function HomeLogo() {
  const pathname = useFullPath();
  const isJuu17Home = pathname === "/";
  const isOneHome = pathname.startsWith("/one");

  const href = isProduction ? "/" : isOneHome ? "/one" : "/brands";

  if (isJuu17Home) {
    return <div></div>;
  }

  return (
    <Link href={href} aria-current="page" className="link-block-2 inline-block">
      <Image
        src={isOneHome ? "/icons/logo-one.svg" : "/icons/logo.svg"}
        loading="lazy"
        width={isOneHome ? 80 : 63}
        height={isOneHome ? 80 : 68}
        alt=""
        className="md:absolute md:left-[1.3em] md:top-[1.3em]"
      />
    </Link>
  );
}
