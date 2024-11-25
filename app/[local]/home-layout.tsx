"use client";
import { useAtomValue } from "jotai/react";

import SignDialog from "@/components/sign-dialog";

import { UuidAtom } from "@/lib/api/state";
import Script from "next/script";
import HomeLinks from "./home-links";
import { Link } from "@/app/navigation";
import Image from "next/image";
import { LayoutBg } from "@/components/layout-bg";

export function HomeLayout({ children }: { children: React.ReactNode }) {
  const uuid = useAtomValue(UuidAtom);

  return (
    <div className="section !pointer-events-auto" id="__next">
      <Script
        id="lazy-animation"
        dangerouslySetInnerHTML={{
          __html: `
          window.addEventListener("load", function() {
            
          });
        `,
        }}
      ></Script>
      <div className="main-container">
        <div className="grid">
          <div className="left-block">
            <Link
              href="/home"
              aria-current="page"
              className="link-block-2 inline-block"
            >
              <Image
                src="/icons/logo.svg"
                loading="lazy"
                width={80}
                height={80}
                alt=""
                className="md:absolute md:left-[1.3em] md:top-[1.3em]"
              />
            </Link>
            <HomeLinks />
            <div className="text-block-4 w-full overflow-hidden text-ellipsis whitespace-nowrap">
              © JUU17 Brands.
            </div>
          </div>

          <div className="right-block content-container md:min-h-unset relative min-h-[200.0025px]">
            {uuid ? children : <SignDialog />}
          </div>
        </div>
        <LayoutBg />
        {/* <div id="gif-animation" className="gif-animation"></div> */}
        <div className="mob-div">
          <div className="text-block-4 mobile">© JUU17 Brands.</div>
        </div>
      </div>
    </div>
  );
}
