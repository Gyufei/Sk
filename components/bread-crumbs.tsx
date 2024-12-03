"use client";
import { usePathname } from "@/app/navigation";
import { useMemo } from "react";

export function BreadCrumbs() {
  const pathname = usePathname() || '';
  const pathnameArr = useMemo(() => {
    return pathname.split('/').filter(item => item != '').map((string) => {
      const newStr = string.replace(/-/g, ' ');
      return newStr.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }) as string[]
  }, [pathname])

  
  return (
    <div className="text-lg text-white flex flex-row font-semibold">
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
