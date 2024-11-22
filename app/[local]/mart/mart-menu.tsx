import Image from "next/image";
import { usePathname, useRouter } from "@/app/navigation";
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
  const router = useRouter();

  const linkText = "text-[12px] md:text-base font-semibold md:leading-6 text-white opacity-60 data-[active=true]:opacity-100";

  return (
    <>
      <div className="flex flex-row w-full md:flex-col md:w-[120px] md:gap-5 right-120">
        {
          menuItems.map((item, index) => {
            const isAcitive = pathname === item.href
            return (
              <MenuItem 
                active={isAcitive} 
                key={item.href} 
                isfirst={index==0} 
                onClick={() => router.push(item.href)}
              >
                <Image
                  className="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px]"
                  src={item.iconSrc}
                  width={40}
                  height={40}
                  alt={T(item.name)}
                />
                <div data-active={isAcitive} className={`${cn(linkText)}`}>{T(item.name)}</div>
              </MenuItem>
            )
          })
        }
      </div>
    </>
  );
}


function MenuItem({ active, isfirst, onClick, children }: { active: boolean; isfirst:boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      data-active={active}
      className={`flex w-[50%] h-[48px] sm:pd-0 sm:h-[105px] sm:w-[105px] md:h-[120px] md:w-[120px] ${isfirst ? 'rounded-l-[24px]' : 'rounded-r-[24px]'} cursor-pointer flex-col items-center justify-center md:gap-y-2 md:rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]  data-[active=true]:sm:border data-[active=true]:sm:border-[rgba(255,255,255,0.6)]`}
      style={{
        backdropFilter: "blur(12px)",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
