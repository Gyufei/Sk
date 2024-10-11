import Script from "next/script";
import HomeLinks from "./home-links";
import { Link } from "@/app/navigation";

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
              <svg
                fill="none"
                version="1.1"
                width="80"
                height="80"
                viewBox="0 0 80 80"
              >
                <defs>
                  <clipPath id="0_2629_4210">
                    <rect x="0" y="0" width="80" height="80" rx="0" />
                  </clipPath>
                </defs>
                <g clip-path="url(#0_2629_4210)">
                  <g>
                    <path
                      d="M20.5233,46.8779C20.5888,46.6636,20.9129,45.9246,21.441,45.3965C21.9163,44.9212,22.0448,44.9942,23.9759,44.1291Q51.0189,33.3314,61.9188,28.9276L66.2699,22.4768L32.0031,22.4768L25.2433,22.4768L14.1532,22.4768C13.6865,22.4768,13.3082,22.0985,13.3082,21.6319L13.3082,14.87214C13.3082,14.40547,13.6865,14.02717,14.1532,14.02717L24.3984,14.02717L24.3984,6.844965C24.3984,6.378304,24.7767,6,25.2433,6L32.0031,6C32.4697,6,32.848,6.378304,32.848,6.844965L32.848,14.02717L58.5138,14.02717L58.5138,6.844965C58.5138,6.378304,58.8921,6,59.3588,6L66.1185,6C66.5852,6,66.9635,6.378304,66.9635,6.844965L66.9635,14.02717L75.3075,14.02717C75.3333,14.02717,75.3651,14.02633,75.4021,14.02536C75.6585,14.01862,76.1608,14.0054,76.5853,14.22088C76.5853,14.22095,77.1558,14.5552,77.1559,14.55527L79.6274,16.2729C80.0143,16.5338,80.1164,17.058999999999997,79.8555,17.4459L76.6027,22.2682L67.6735,35.5065C67.6289,35.572500000000005,67.5757,35.631299999999996,67.5157,35.6816C67.4312,35.778400000000005,67.3232,35.857299999999995,67.1959,35.9088L28.3063,51.5753Q28.1479,51.6281,28.0423,51.7337Q27.9367,51.8394,27.831,52.209L21.1076,73.8934C20.9712,74.3397,20.4376,74.6657,19.9469,74.6657L12.9544,74.6961C12.5081,74.5597,12.257,74.0873,12.3934,73.641L20.5233,46.8779ZM0,14.87214L0,73.8085C0,74.2751,0.378303,74.6534,0.844965,74.6534L7.60469,74.6534C8.07135,74.6534,8.44965,74.2751,8.44965,73.8085L8.44965,14.87214C8.44965,14.40547,8.07135,14.02717,7.60469,14.02717L0.844965,14.02717C0.378303,14.02717,0,14.40547,0,14.87214Z"
                      fill-rule="evenodd"
                      fill="#F8F6F3"
                      fill-opacity="0.75"
                    />
                  </g>
                </g>
              </svg>
            </Link>
            <HomeLinks />
            <div className="text-block-4">© JUU17 Brands.</div>
          </div>

          <div
            data-id=""
            className="right-block content-container md:min-h-unset relative min-h-[200px]"
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
