"use client";

import { useEffect, useState } from "react";

export function LayoutBg() {
  const [src, setSrc] = useState<string | null>(null);

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
    </div>
  );
}
