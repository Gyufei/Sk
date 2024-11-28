import HomeLinks from "./home-links";
import { Link } from "@/app/navigation";
import Image from "next/image";
import { LayoutBg } from "@/components/layout-bg";
import HomeContent from "./home-content";

export function HomeLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="section !pointer-events-auto" id="__next">
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
          <HomeContent>{children}</HomeContent>
        </div>
        <LayoutBg />
        <div className="mob-div">
          <div className="text-block-4 mobile">© JUU17 Brands.</div>
        </div>
      </div>
    </div>
  );
}
