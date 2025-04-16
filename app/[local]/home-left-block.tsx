"use client";
import { cn } from "@/lib/utils/utils";
import HomeLinks from "./home-links";
import { HomeLogo } from "./home-logo";
import { useFullPath } from "@/lib/use-full-path";
import { FooterLink } from "./footer-link";

export function HomeLeftBlock() {
  const pathname = useFullPath();
  const isJuu17Home = pathname === "/";
  const isOneHome = pathname.startsWith("/one");
  const isBrandsHome = pathname.startsWith("/brands");
  return (
    <div
      className={cn(
        "left-block",
        isJuu17Home && "h-[300px] sm:h-auto",
        isOneHome && "sm:min-h-auto h-20 min-h-[5em] sm:h-auto",
        isBrandsHome && "h-[200px] min-h-[200px] sm:h-auto",
      )}
    >
      <HomeLogo />
      <HomeLinks />
      <div className="hidden sm:block">
        <FooterLink />
      </div>
    </div>
  );
}
