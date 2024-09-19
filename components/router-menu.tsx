import Image from "next/image";
import Link from "next/link";

export default function RouterMenu() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <Link href="/club/events">
        <MenuItem>
          <Image src="/icons/events.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            Events
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
            Shipping
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/info">
        <MenuItem>
          <Image src="/icons/info.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            Info
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/mart">
        <MenuItem>
          <Image src="/icons/mart.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            Mart
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/club">
        <MenuItem>
          <Image src="/icons/club.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            Club
          </div>
        </MenuItem>
      </Link>
      <Link href="/club/ticket">
        <MenuItem>
          <Image src="/icons/ticket.svg" width={40} height={40} alt="events" />
          <div className="text-base font-semibold leading-6 text-white opacity-60">
            Ticket
          </div>
        </MenuItem>
      </Link>
    </div>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-[120px] w-[120px] cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
