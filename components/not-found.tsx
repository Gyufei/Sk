"use client";

import { useEffect } from "react";
import { useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";
import { useFullPath } from "@/lib/use-full-path";
import { isProduction } from "@/lib/api/path";

export default function NotFound() {
  const router = useRouter();
  const T = useTranslations("Common");
  const pathname = useFullPath();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isProduction) {
        router.push("/");
      } else {
        if (pathname.includes("brands")) {
          router.push("/brands");
        } else if (pathname.includes("one")) {
          router.push("/one");
        } else {
          router.push("/");
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:-ml-[200px]">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl">{T("PageNotFound")}</p>
      <p className="text-md mt-2">{T("RedirectingToHome")}</p>
    </div>
  );
}
