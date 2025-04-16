import { LayoutBg } from "@/components/layout-bg";
import { HomeLeftBlock } from "./home-left-block";
import HomeContent from "./home-content";
import { FooterLink } from "./footer-link";

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="section !pointer-events-auto" id="__next">
      <div className="main-container">
        <div className="grid">
          <HomeLeftBlock />
          <HomeContent>{children}</HomeContent>
        </div>
        <LayoutBg />
        <div className="sm:hidden block">
          <FooterLink />
        </div>
      </div>
    </div>
  );
}
