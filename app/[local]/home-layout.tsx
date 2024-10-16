import Script from "next/script";
import HomeLinks from "./home-links";
import { Link } from "@/app/navigation";
import Image from "next/image";

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="section !pointer-events-auto" id="__next">
      <Script
        id="lazy-animation"
        dangerouslySetInnerHTML={{
          __html: `
          window.addEventListener("load", function() {
            setTimeout(() => {
              const gitCon = document.getElementById("gif-animation");
              if (!gitCon) return;
              gitCon.innerHTML = '<img src="https://juu17.com/sphere_25-fps_small.gif" loading="lazy" alt="" />';
            }, 1000);
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
                className="point-1"
              />
            </Link>
            <HomeLinks />
            <div className="text-block-4 w-full whitespace-nowrap overflow-hidden text-ellipsis">
              © JUU17 Brands.
            </div>
          </div>

          <div
            data-id=""
            className="right-block content-container md:min-h-unset relative min-h-[200px] md:-ml-[200px]"
          >
            {children}
          </div>
        </div>
        <div id="gif-animation" className="gif-animation"></div>
        <div className="mob-div">
          <div className="text-block-4 mobile">© JUU17 Brands.</div>
        </div>
      </div>
    </div>
  );
}
