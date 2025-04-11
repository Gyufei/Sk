import { LayoutBg } from "@/components/layout-bg";
import { HomeLeftBlock } from "./home-left-block";
import HomeContent from "./home-content";

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="section !pointer-events-auto" id="__next">
      <div className="main-container">
        <div className="grid">
          <HomeLeftBlock />
          <HomeContent>{children}</HomeContent>
        </div>
        <LayoutBg />
        <div className="mob-div z-10">
          <div className="text-block-4 mobile">© JUU17 Brands.</div>
        </div>
      </div>
    </div>
  );
}
