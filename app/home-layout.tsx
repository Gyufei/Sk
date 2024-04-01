"use client";
import Image from "next/image";

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet } from "viem/chains";
import Link from "next/link";
import { usePathname } from "next/navigation";

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <DynamicContextProvider
      settings={
        {
          environmentId: "554fd33c-07f9-48c9-83b7-379975d52c11",
          walletConnectors: [EthereumWalletConnectors],
        } as any
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <div className="section" id="__next">
              <div className="main-container">
                <div className="w-layout-grid grid">
                  <div className="left-block">
                    <a
                      href="index.html"
                      aria-current="page"
                      className="link-block-2 w-inline-block w--current"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="80"
                        viewBox="142 175 133 127"
                      >
                        <defs>
                          <clipPath>
                            <rect
                              x="0"
                              y="0"
                              width="1024"
                              height="1024"
                              rx="0"
                            />
                          </clipPath>
                        </defs>
                        <g clipPath="url(#master_svg0_10_15)">
                          <g>
                            <rect
                              x="150"
                              y="198"
                              width="13"
                              height="94"
                              rx="6.5"
                              fill="#D4D4D4"
                              fillOpacity="1"
                            />
                          </g>
                          <g>
                            <path
                              d="M193.6156,186C190.0177,186,187.101,188.92048,187.101,192.52308L187.101,198.3938L176.5168,198.3938C172.91767,198.3938,170,201.3147,170,204.9177L170,205.7332C170,209.3362,172.91767,212.257,176.5168,212.257L250.73489999999998,212.257L244.7491,221.141L184.4738,245.5201C182.4665,246.332,180.9929,248.0888,180.54149999999998,250.20850000000002L170.320976,283.67449999999997C169.287656,287.058,171.24014,290.655,174.68197,291.70799999999997C178.12378999999999,292.762,181.7516,290.873,182.7849,287.48900000000003L192.2673,256.4403L251.4407,232.5069C251.95850000000002,232.2974,252.44740000000002,232.0222,252.8951,231.6879Q252.8961,231.6872,252.8971,231.6864C253.50709999999998,231.2407,254.0351,230.6921,254.4574,230.0653L268.8852,208.6521C270.898,205.6651,270.11,201.6103,267.1267,199.5955C266.21659999999997,198.9809,265.16610000000003,198.6065,264.07280000000003,198.507C263.6744,198.4317,263.2699,198.3938,262.8644,198.3938L252.899,198.3938L252.899,192.52308C252.899,188.92048,249.9823,186,246.3844,186C242.78640000000001,186,239.8697,188.92048,239.8697,192.52308L239.8697,198.3938L200.1303,198.3938L200.1303,192.52308C200.1303,188.92048,197.21359999999999,186,193.6156,186Z"
                              fillRule="evenodd"
                              fill="#D4D4D4"
                              fillOpacity="1"
                            />
                          </g>
                        </g>
                      </svg>
                    </a>
                    <ul className="navbar">
                      <li
                        className={pathname === "/home" ? "active" : ""}
                        data-id="home"
                      >
                        <Link href="/home">Home</Link>
                      </li>
                      <li
                        className={pathname === "/dragon-ish" ? "active" : ""}
                        data-id="dragon-ish"
                      >
                        <Link href="/dragon-ish">Dragon-ish</Link>
                      </li>
                      <li
                        className={pathname === "/club" ? "active" : ""}
                        data-id="club"
                      >
                        <Link href="/club">Club</Link>
                      </li>
                      <li
                        className={pathname === "/service" ? "active" : ""}
                        data-id="service"
                      >
                        <Link href="/service">Service</Link>
                      </li>
                    </ul>
                    <div className="text-block-4">
                      © JUU17. All rights reserved.
                    </div>
                  </div>

                  <div data-id="" className="w-layout-grid right-grid-block">
                    <div className="top-content">{children}</div>
                    <div className="bottom-content">
                      <div className="field-label-text">Dive a bit deeper</div>
                      <div className="html-embed-4 w-embed">
                        <form
                          className="update-form"
                          action="https://tally.so/r/mRo66p"
                          method="get"
                          target="_blank"
                        >
                          <input
                            type="hidden"
                            name="transparentBackground"
                            value="1"
                          />
                          <input
                            className="text-field w-input"
                            required
                            type="email"
                            name="email"
                            placeholder="Your email"
                            maxLength={50}
                          />
                          <button
                            className="submit-button w-button"
                            type="submit"
                          >
                            Submit a request
                          </button>
                        </form>
                      </div>
                      <Image
                        src="./ellipse_ico.svg"
                        loading="lazy"
                        width={8}
                        height={8}
                        alt=""
                        className="point-3"
                      />
                      <Image
                        src="./ellipse_ico.svg"
                        loading="lazy"
                        alt=""
                        width={8}
                        height={8}
                        className="point-4"
                      />
                    </div>
                  </div>
                </div>
                <div className="gif-animation">
                  <img src="./sphere_25-fps_small.gif" loading="lazy" alt="" />
                </div>
                <div className="mob-div">
                  <div className="text-block-4 mobile">
                    © JUU17. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
