import { Metadata } from "next";

export const BrandsMetadata: Metadata = {
  title: {
    template: "%s | Juu17 Brands",
    default: "Juu17 Brands",
  },
  metadataBase: new URL("https://brands.juu17.com/"),
  description:
    "An industry-standard output platform initiated by Juu17 — exclusively open to forward-thinking eligible players. It focuses on project quality evaluation, token-level assessment, liquidity monitoring, and discussions on regulatory policy frameworks.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1.0,
    maximumScale: 1.0,
  },
  openGraph: {
    url: "https://brands.juu17.com/",
    title: "Juu17 Brands",
    description:
      "An industry-standard output platform initiated by Juu17 — exclusively open to forward-thinking eligible players. It focuses on project quality evaluation, token-level assessment, liquidity monitoring, and discussions on regulatory policy frameworks.",
    siteName: "Juu17 Brands",
    images: "/images/brands/bm0TsjJSKFZti1BKt6pJMyyp0BE.png",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juu17 Brands",
    description:
      "An industry-standard output platform initiated by Juu17 — exclusively open to forward-thinking eligible players. It focuses on project quality evaluation, token-level assessment, liquidity monitoring, and discussions on regulatory policy frameworks.",
    images: ["https://juu17.com/images/brands/bm0TsjJSKFZti1BKt6pJMyyp0BE.png"],
    creator: "@Juu17Brands",
    site: "@Juu17Brands",
  },
  icons: {
    icon: [{ url: "/images/brands/favicon-32x32.png" }],
    apple: [
      { url: "/images/brands/android-chrome-512x512.png" },
      {
        url: "/images/brands/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "https://brands.juu17.com/",
  },
};

export const OneMetadata: Metadata = {
  title: {
    template: "%s | Juu17 One",
    default: "Juu17 One",
  },
  metadataBase: new URL("https://one.juu17.com/"),
  description:
    "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1.0,
    maximumScale: 1.0,
  },
  openGraph: {
    url: "https://one.juu17.com/",
    title: "Juu17 One",
    description:
      "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
    siteName: "Juu17 One",
    images: "/images/one/bm0TsjJSKFZti1BKt6pJMyyp0BE.png",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juu17 One",
    description:
      "A senior market maker, a visionary team jefe, and a supreme influencer set to help Web3 challengers solve the puzzles.",
    images: ["https://juu17.com/images/one/bm0TsjJSKFZti1BKt6pJMyyp0BE.png"],
    creator: "@Juu17__",
    site: "@Juu17__",
  },
  icons: {
    icon: [{ url: "/images/one/favicon-32x32.png" }],
    apple: [
      { url: "/images/one/android-chrome-512x512.png" },
      {
        url: "/images/one/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "https://one.juu17.com/",
  },
};
