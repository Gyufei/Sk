import Image from "next/image";
import { Link } from "@/app/navigation";
import { useTranslations } from "next-intl";

export default function RouterMenu() {
  const T = useTranslations("Common");

  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <Link href="/club/events">
        <MenuItem>
          <Image src="/icons/events.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Events")}
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/shipping">
        <MenuItem>
          <Image
            src="/icons/shipping.svg"
            width={40}
            height={40}
            alt="events"
          />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Shipping")}
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/info">
        <MenuItem>
          <Image src="/icons/info.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Info")}
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/mart">
        <MenuItem>
          <Image src="/icons/mart.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Mart")}
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/club">
        <MenuItem>
          <Image src="/icons/club.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Club")}
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/ticket">
        <MenuItem>
          <Image src="/icons/ticket.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            {T("Ticket")}
          </div>
        </MenuItem>
      </Link>
    </div>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex md:h-[120px] h-[105px] md:w-[120px] w-[105px]  cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
