import localFont from "next/font/local";

export const HaasGrotDisp = localFont({
  src: [
    {
      path: "../public/fonts/NeueHaasGrotDispRound-55Roman.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasGrotDispRound-65Medium.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-haas-disp",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const HaasGrotText = localFont({
  src: [
    {
      path: "../public/fonts/NeueHaasGrotTextRound-55Roman.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasGrotTextRound-65Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueHaasGrotTextRound-75Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-haas-text",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});
