import Image from "next/image";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useRouter } from "@/app/navigation";
import { GlobalMsgContext } from "./global-msg-context";
import { cn } from "@/lib/utils/utils";

const clubList = [
  {
    name: "Events",
    href: "/dashboard/events",
    iconSrc: "/icons/events.svg",
    msg: "EventsLevelRequired",
  },
  { name: "Point", href: "/dashboard/point", iconSrc: "/icons/point.svg" },
  {
    name: "Features",
    href: "/dashboard/features",
    iconSrc: "/icons/features.svg",
    msg: "LevelRequired",
  },
  {
    name: "Assets",
    href: "/dashboard/assets",
    iconSrc: "/icons/assets.svg",
    msg: "LevelRequired",
  },
  {
    name: "SocialMedia",
    href: "/dashboard/social-media",
    iconSrc: "/icons/social-media.svg",
  },
  {
    name: "Ticket",
    href: "/dashboard/ticket",
    iconSrc: "/icons/ticket.svg",
    msg: "TicketLevelRequired",
  },
];

export default function RouterMenu() {
  const T = useTranslations("Common");
  const router = useRouter();
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const { data: userInfo } = useFetchUserInfo();
  const levelGt2 = userInfo?.level >= 2;

  function handleGoWithMembership(href: string, msg: string) {
    if (!levelGt2) {
      setGlobalMessage({
        type: "warning",
        message: msg,
      });
    } else {
      router.push(href);
    }
  }

  const linkText = "text-base font-semibold leading-6 text-white opacity-60 font-haasDisp";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-y-[4vw] sm:gap-5">
        {clubList.map((item) => {
          return (
            <div
              key={item.href}
              onClick={() => {
                if (item.msg) {
                  handleGoWithMembership(item.href, T(item.msg));
                  return;
                }
                router.push(item.href);
              }}
            >
              <MenuItem>
                <Image
                  src={item.iconSrc}
                  width={40}
                  height={40}
                  alt={T(item.name)}
                />
                <div className={cn(linkText)}>{T(item.name)}</div>
              </MenuItem>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MenuItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-haasDisp bg-blur12 flex h-[28vw] w-[28vw]  min-w-[105px] min-h-[105px] cursor-pointer flex-col items-center justify-center gap-y-2 rounded-[20px] bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] sm:h-[120px] sm:w-[120px]"
    >
      {children}
    </div>
  );
}
