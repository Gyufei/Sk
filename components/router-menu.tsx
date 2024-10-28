import Image from "next/image";
import { Link } from "@/app/navigation";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useRouter } from "@/app/navigation";
import { GlobalMsgContext } from "./global-msg-context";
import { cn } from "@/lib/utils/utils";

export default function RouterMenu() {
  const T = useTranslations("Common");
  const router = useRouter();
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { data: userInfo } = useFetchUserInfo();
  const hasMembership = userInfo?.membership_no;

  function handleGoWithMembership(href: string, msg: string) {
    if (!hasMembership) {
      setGlobalMessage({
        type: "warning",
        message: msg,
      });
    } else {
      router.push(href);
    }
  }

  const linkText = "text-base font-semibold leading-6 text-white opacity-60";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Link href="/club/mart">
          <MenuItem>
            <Image src="/icons/mart.svg" width={40} height={40} alt="mart" />
            <div className={cn(linkText)}>{T("Mart")}</div>
          </MenuItem>
        </Link>

        <Link href="/club/shipping">
          <MenuItem>
            <Image
              src="/icons/shipping.svg"
              width={40}
              height={40}
              alt="shipping"
            />
            <div className={cn(linkText)}>{T("Shipping")}</div>
          </MenuItem>
        </Link>
        <Link href="/club/info">
          <MenuItem>
            <Image src="/icons/info.svg" width={40} height={40} alt="info" />
            <div className={cn(linkText)}>{T("Info")}</div>
          </MenuItem>
        </Link>

        <div
          onClick={() =>
            handleGoWithMembership(
              "/club/events",
              T("EventsMembershipRequired"),
            )
          }
        >
          <MenuItem>
            <Image src="/icons/events.svg" width={40} height={40} alt="info" />
            <div className={cn(linkText)}>{T("Events")}</div>
          </MenuItem>
        </div>

        <div
          onClick={() =>
            handleGoWithMembership("/club/club", T("MembershipRequired"))
          }
        >
          <MenuItem>
            <Image src="/icons/club.svg" width={40} height={40} alt="info" />
            <div className={cn(linkText)}>{T("Club")}</div>
          </MenuItem>
        </div>

        <div
          onClick={() =>
            handleGoWithMembership(
              "/club/ticket",
              T("TicketMembershipRequired"),
            )
          }
        >
          <MenuItem>
            <Image src="/icons/ticket.svg" width={40} height={40} alt="info" />
            <div className={cn(linkText)}>{T("Ticket")}</div>
          </MenuItem>
        </div>
      </div>
    </>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-[105px] w-[105px] cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] md:h-[120px] md:w-[120px]"
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {children}
    </div>
  );
}
