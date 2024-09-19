import "./globals.css";
import type { Metadata } from "next";
import { HaasGrotDisp, HaasGrotText } from "./font";
import Script from "next/script";
import { HomeLayout } from "./home-layout";
import { Web3Modal } from "@/components/web3-modal";

export const metadata: Metadata = {
  title: {
    template: "%s | Juu17 Brands",
    default: "Juu17 Brands",
  },
  metadataBase: new URL("https://juu17.com/"),
  description:
    "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
  viewport: { width: "device-width", initialScale: 1 },
  openGraph: {
    url: "https://juu17.com/",
    title: "Juu17 Brands",
    description:
      "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
    siteName: "Juu17 Brands",
    images: "/images/bm0TsjJSKFZti1BKt6pJMyyp0BE.png",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juu17 Brands",
    description:
      "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
    images: ["https://juu17.com/images/bm0TsjJSKFZti1BKt6pJMyyp0BE.png"],
    creator: "@Juu17__",
    site: "@Juu17__",
  },
  icons: {
    icon: [{ url: "/images/favicon-32x32.png" }],
    apple: [
      { url: "/images/icon_256.png" },
      {
        url: "/images/icon_180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "https://juu17.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-GED2STRV1H"
      ></Script>
      <Script
        id="gTag"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-GED2STRV1H');
              `,
        }}
      ></Script>
      <Script
        src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        type="text/javascript"
      ></Script>
      <Script
        id="touch"
        dangerouslySetInnerHTML={{
          __html: `
                !(function (o, c) {
                    var n = c.documentElement,
                        t = ' w-mod-'
                    ;(n.className += t + 'js'), ('ontouchstart' in o || (o.DocumentTouch && c instanceof DocumentTouch)) && (n.className += t + 'touch')
                })(window, document)
              `,
        }}
      ></Script>
      <body
        className={`body ${
          (HaasGrotDisp.variable, HaasGrotText.variable)
        } !pointer-events-auto`}
      >
        <Web3Modal>
          <HomeLayout>{children}</HomeLayout>
        </Web3Modal>
      </body>
    </html>
  );
}
