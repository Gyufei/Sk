import { cn } from "@/lib/utils/utils";
import { Link } from "@/app/navigation";
import { ReactNode, useState } from "react";
import { useFullPath } from "@/lib/use-full-path";

export function LinkComp({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = useFullPath();

  function isPathActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  const [isHover, setIsHover] = useState(false);

  const isActive = isPathActive(href);

  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(
        (isActive || isHover) && "link-active opacity-100",
        "w-fit cursor-pointer py-[6px] font-haasDisp text-[30px] font-medium leading-[44px] opacity-50 sm:static sm:py-0 sm:text-[2.5em] sm:leading-normal",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
