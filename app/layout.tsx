import "./globals.css";
import type { Metadata } from "next";
import { manrope } from "./font";
import Script from "next/script";
import { HomeLayout } from "./home-layout";
import { WcProvider } from "@/components/wc-provider";

export const metadata: Metadata = {
  title: "Juu17 Platoon",
  metadataBase: new URL("https://juu17.com/"),
  description:
    "My experience as a senior market maker, a visionary team jefe, and a supreme influencer sets me apart to help Web3 challengers solve the puzzles.",
  viewport: { width: "device-width", initialScale: 1 },
  openGraph: {
    type: "website",
    url: "https://juu17.com/",
    title: "Juu17 Platoon",
    description:
      "My experience as a senior market maker, a visionary team jefe, and a supreme influencer sets me apart to help Web3 challengers solve the puzzles.",
    siteName: "Juu17 Platoon",
    images: [
      {
        url: "https://juu17.com/bm0TsjJSKFZti1BKt6pJMyyp0BE.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juu17 Platoon",
    description:
      "My experience as a senior market maker, a visionary team jefe, and a supreme influencer sets me apart to help Web3 challengers solve the puzzles.",
    images: ["https://juu17.com/bm0TsjJSKFZti1BKt6pJMyyp0BE.png"],
    creator: "@0xjuu_17",
    site: "@0xjuu_17",
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
      <body className={`body ${manrope.className}`}>
        <WcProvider>
          <HomeLayout>{children}</HomeLayout>
        </WcProvider>
      </body>
    </html>
  );
}
