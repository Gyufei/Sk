"use client";
import { usePathname } from "@/app/navigation";
import { useAtomValue } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import { useEffect, useMemo, useState } from "react";

const blurPaths = ['/club/point', '/one', '/mart/shipping'];

export function LayoutBg() {
  const [src, setSrc] = useState<string | null>(null);
  const uuid = useAtomValue(UuidAtom);
  const pathname = usePathname();

  const isPathBlur = useMemo(() => {
    return blurPaths.includes(pathname) || !uuid 
  }, [pathname])

  useEffect(() => {
    setTimeout(() => {
      setSrc("https://juu17.com/sphere_25-fps_small.gif")
    }, 1500)
  }, [])

  return (
    <div id="gif-animation" className="gif-animation">
      {
        src && (
          <img src={src} loading="lazy" alt="" />
        )
      }
      {
        isPathBlur && (
          <div className="absolute z-0 left-0 right-0 bottom-0 top-0 content-bg-blur"></div>
        )
      }
    </div>
  );
}
