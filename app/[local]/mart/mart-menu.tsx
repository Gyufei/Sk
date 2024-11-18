import Image from "next/image";
import { Link, usePathname } from "@/app/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/utils";

const menuItems = [
  { name: "Shipping", href: "/mart/shipping", iconSrc: "/icons/shipping.svg"},
  { name: "Mart", href: "/mart", iconSrc: "/icons/mart-items.svg"},
]

export default function MartMenu() {
  // 获取当前路由
  const T = useTranslations("Common");
  const pathname = usePathname();

  const linkText = "text-base font-semibold leading-6 text-white opacity-60 data-[active=true]:opacity-100";

  return (
    <>
      <div className="flex flex-col gap-5 right-120">
        {
          menuItems.map((item) => {
            const isAcitive = pathname === item.href
            return (
              <Link 
                href={item.href} 
                key={item.href} 
              >
                <MenuItem active={isAcitive}>
                  <Image
                    src={item.iconSrc}
                    width={40}
                    height={40}
                    alt={T(item.name)}
                  />
                  <div data-active={isAcitive} className={`${cn(linkText)}`}>{T(item.name)}</div>
                </MenuItem>
              </Link>
            )
          })
        }
      </div>
    </>
  );
}


function MenuItem({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      data-active={active}
      className="flex h-[105px] w-[105px] cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] md:h-[120px] md:w-[120px]  data-[active=true]:border border-[rgba(255,255,255,0.6)]`"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
