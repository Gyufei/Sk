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
    <div className="text-lg text-white flex flex-row">
      {
        pathnameArr.map((item, index) => {
          const isLast = (index + 1) === pathnameArr.length
          return (
            <div key={item + '_' + index}>
              <div className={`${isLast ? ('opacity-100 inline') : 'hidden opacity-80'} sm:inline`}>{item}</div>
              {
                !isLast && (
                <div className="opacity-80 mx-2 hidden sm:inline">/</div>
                )
              }
            </div>
          )
        })
      }
    </div>
  );
}
