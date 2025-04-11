"use client";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { useEffect, useMemo, useState } from "react";
import { useFullPath } from "@/lib/use-full-path";

const blurPaths = ["/brands", "/club/point", "/mart/shipping"];

export function LayoutBg() {
  const [src, setSrc] = useState<string | null>(null);
  const uuid = useAtomValue(UuidAtom);
  const pathname = useFullPath();

  const isPathBlur = useMemo(() => {
    return blurPaths.includes(pathname) || !uuid;
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      setSrc(`https://juu17.com/sphere_25-fps_small.gif`);
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
