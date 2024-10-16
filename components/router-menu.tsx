import Image from "next/image";
import { Link } from "@/app/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";

function ProtectedMenuItem({ href, icon, label, requiresMembership, setShowTooltip }: {
  href: string;
  icon: string;
  label: string;
  requiresMembership: boolean;
  setShowTooltip: (show: boolean) => void;
}) {
  const { data: userInfo } = useFetchUserInfo();
  const T = useTranslations("Common");

  const hasMembership = userInfo?.membership_no;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (requiresMembership && !hasMembership) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <Link href={href} onClick={handleClick}>
        <MenuItem>
          <Image src={icon} width={40} height={40} alt={label} />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T(label)}
          </div>
        </MenuItem>
      </Link>
    </div>
  );
}

export default function RouterMenu() {
  const T = useTranslations("Common");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <ProtectedMenuItem
          href="/club/events"
          icon="/icons/events.svg"
          label="Events"
          requiresMembership={true}
          setShowTooltip={setShowTooltip}
        />
        <Link href="/club/shipping">
          <MenuItem>
            <Image src="/icons/shipping.svg" width={40} height={40} alt="shipping" />
            <div className="text-base font-semibold leading-6 text-white opacity-60">
              {T("Shipping")}
            </div>
          </MenuItem>
        </Link>
        <Link href="/club/info">
          <MenuItem>
            <Image src="/icons/info.svg" width={40} height={40} alt="info" />
            <div className="text-base font-semibold leading-6 text-white opacity-60">
              {T("Info")}
            </div>
          </MenuItem>
        </Link>
        <Link href="/club/mart">
          <MenuItem>
            <Image src="/icons/mart.svg" width={40} height={40} alt="mart" />
            <div className="text-base font-semibold leading-6 text-white opacity-60">
              {T("Mart")}
            </div>
          </MenuItem>
        </Link>

        <ProtectedMenuItem
          href="/club/club"
          icon="/icons/club.svg"
          label="Club"
          requiresMembership={true}
          setShowTooltip={setShowTooltip}
        />
        <ProtectedMenuItem
          href="/club/ticket"
          icon="/icons/ticket.svg"
          label="Ticket"
          requiresMembership={true}
          setShowTooltip={setShowTooltip}
        />
      </div>
      {showTooltip && (
        <div className="fixed md:ml-[-25px]  bottom-[37px] md:w-[450px] w-[calc(100%-30px)]  h-[56px] pl-[20px] flex rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-[12px] opacity-1 z-50">
          <div className="flex items-center">
            <Image src="/icons/lamp.svg" width={24} height={24} alt="info" className="mr-2" />
            <span className="text-white text-sm md:text-base font-semibold leading-6 text-white opacity-60" >{T("MembershipRequired")}</span>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex md:h-[120px] h-[105px] md:w-[120px] w-[105px] cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
