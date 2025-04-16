"use client";
import Image from "next/image";
import { useFullPath } from "@/lib/use-full-path";
import { LinkComp } from "./link-comp";

const twitterLink = {
  id: "one",
  pathname: "https://x.com/Juu17Brands",
  href: "https://x.com/Juu17Brands",
  name: "One",
  src: "/icons/x-no-bg.svg",
};

export function FooterLink() {
  const pathname = useFullPath();
  const isBrands = pathname.startsWith("/brands");

  return (
    <>
      <div className="flex-col gap-2 flex items-center sm:items-start">
        {isBrands && (
          <LinkComp href={twitterLink.href}>
            <Image src={twitterLink.src} width={40} height={40} alt="" />
          </LinkComp>
        )}
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="w-full overflow-visible sm:text-[1.4em] text-[4em] sm:text-left text-center">
            © JUU17 Brands.
          </div>
        </div>
      </div>
    </>
  );
}
