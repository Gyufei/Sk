"use client";
import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/utils";

const menuItems = [
  { name: "Shipping", href: "/mart/shipping", iconSrc: "/icons/shipping.svg" },
  { name: "Mart", href: "/mart", iconSrc: "/icons/mart-items.svg" },
];

export default function MartMenu() {
  // 获取当前路由
  const T = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();

  const linkText =
    "font-haasDisp text-[12px] sm:text-base font-semibold sm:leading-6 text-white opacity-60 group-hover:opacity-100 data-[active=true]:opacity-100";

  const rightOffset =
    pathname === menuItems[0].href ? "sm:-right-[140px]" : "sm:-right-[120px]";

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-8 z-50 mt-6 sm:absolute sm:left-[auto] sm:top-[5px]",
        rightOffset,
      )}
    >
      <div className="right-120 flex w-full flex-row sm:w-[120px] sm:flex-col sm:gap-5">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <MenuItem
              active={isActive}
              key={item.href}
              isFirst={index == 0}
              onClick={() => router.push(item.href)}
            >
              <div
                className={`${
                  isActive ? "opacity-100" : "opacity-80"
                } group-hover:opacity-100`}
              >
                <Image
                  className="h-[20px] w-[20px] sm:h-[40px] sm:w-[40px]"
                  src={item.iconSrc}
                  width={40}
                  height={40}
                  alt={T(item.name)}
                />
              </div>

              <div data-active={isActive} className={`${cn(linkText)}`}>
                {T(item.name)}
              </div>
            </MenuItem>
          );
        })}
      </div>
    </div>
  );
}

function MenuItem({
  active,
  isFirst,
  onClick,
  children,
}: {
  active: boolean;
  isFirst: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-active={active}
      className={`bg-blur12 sm:pd-0 group flex h-[48px] w-[50%] sm:h-[105px] sm:w-[105px] md:h-[120px] md:w-[120px] ${
        isFirst ? "rounded-l-[24px]" : "rounded-r-[24px]"
      } cursor-pointer flex-col items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] data-[active=true]:sm:border data-[active=true]:sm:border-[rgba(255,255,255,0.6)]  sm:gap-y-2 sm:rounded-[20px]`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
