"use client";
import { usePathname } from "@/app/navigation";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { useEffect, useMemo, useState } from "react";

const blurPaths = [
  "/one",
  "/brands",
  "/brands/club/point",
  "/brands/mart/shipping",
];

export function LayoutBg() {
  const [src, setSrc] = useState<string | null>(null);
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();

  const isPathBlur = useMemo(() => {
    return blurPaths.includes(pathname) || !uuid;
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setSrc(`${window.location.origin}/images/sphere_25-fps_small.gif`);
    }, 1500);
  }, []);

  return (
    <div id="gif-animation" className="gif-animation">
      {src && <img src={src} loading="lazy" alt="" />}
      {isPathBlur && (
        <div className="content-bg-blur absolute bottom-0 left-0 right-0 top-0 z-0"></div>
      )}
    </div>
  );
}
