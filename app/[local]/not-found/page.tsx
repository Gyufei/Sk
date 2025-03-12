"use client";

import { useEffect } from "react";
import { useRouter } from "@/app/navigation";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const T = useTranslations("Common");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl">{T("PageNotFound")}</p>
      <p className="text-md mt-2">{T("RedirectingToHome")}</p>
    </div>
  );
}
