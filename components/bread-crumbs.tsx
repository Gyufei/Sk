"use client";
import { usePathname } from "@/app/navigation";
import { useMemo } from "react";

export function BreadCrumbs() {
  const pathname = usePathname() || '';
  const pathnameArr = useMemo(() => {
    return pathname.split('/').filter(item => item != '').map((string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }) as string[]
  }, [pathname])

  
  return (
    <div className="text-lg text-white">
      {
        pathnameArr.map((item, index) => {
          const isLast = (index + 1) === pathnameArr.length
          return (
            <>
              <span className={`opacity-80 ${isLast&&'opacity-100'}`} key={item}>{item}</span>
              {
                !isLast && (
                <span className="opacity-80 mx-2" key={item}>/</span>
                )
              }
            </>
          )
        })
      }
    </div>
  );
}
