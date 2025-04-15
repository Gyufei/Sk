import type { Metadata } from "next";
import { headers } from "next/headers";
import { HaasGrotDisp, HaasGrotText } from "@/app/font";
import Script from "next/script";
import { HomeLayout } from "./home-layout";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import GlobalActionTip from "@/components/global-action-tip";
import { GlobalMsgProvider } from "@/components/global-msg-context";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Web3Provider } from "@/components/provider/wallet-context";
import WalletDisconnected from "@/components/wallet-disconnected";
import { NotificationListen } from "@/components/notification-listen";
import { Toaster } from "@/components/toaster";
import { SolanaWalletProviders } from "@/components/provider/solana-provider";
import { BrandsMetadata } from "../metadata.config";

export const metadata: Metadata = BrandsMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  const messages = await getMessages();

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
        className={`${HaasGrotDisp.variable} ${HaasGrotText.variable} !pointer-events-auto`}
      >
        <GlobalMsgProvider>
          <NextIntlClientProvider messages={messages}>
            <Web3Provider cookies={cookies}>
              <SolanaWalletProviders>
                <HomeLayout>{children}</HomeLayout>
                <GlobalActionTip />
                <WalletDisconnected />
                <Toaster />
                <NotificationListen />
              </SolanaWalletProviders>
            </Web3Provider>
          </NextIntlClientProvider>
        </GlobalMsgProvider>
      </body>
    </html>
  );
}
