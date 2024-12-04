"use client";
import { GoBackTo } from "@/components/go-back-to";
import { useTranslations } from "next-intl";
import DomainRedirect from "./domain-redirect";
import SearchHistoricalTweets from "./search-historical-tweets";
import FeatureItem from "./feature-item";
import { Switch } from "@/components/ui/switch";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { useNotificationListen } from "@/lib/use-notification-listen";
import { WithTip } from "@/components/with-tip";
import Image from "next/image";


export default function Page() {
  const T = useTranslations("Common");
  const {
    isNotificationSupport,
    notificationChecked,
    onNotificationChecked,
    notificationDisabled
  } = useNotificationListen()

  const notionTitle = (
    <div className="flex align-middle">
      {T("Notification")}
      {
        notificationDisabled && (
          <WithTip
            tipContent={<div>{T("NotificationWarnning")}</div>}
          >
            <Image
              src="/icons/warning.svg"
              width={24}
              height={24}
              className={"ml-[8px]"}
              alt="warning"
            />
          </WithTip>
        )
      }
    </div>
  )
  
  return (
    <div className="no-scroll-bar content-w-600 m-t-20 md:trans-scroll-bar relative  overflow-y-auto md:h-fit md:max-h-[calc(100%-70px)]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="w-full relative mb-[20px] mt-6 content-bg-blur">
        <DomainRedirect />
        {
          isNotificationSupport && (
            <FeatureItem
              title={notionTitle}
              className={
                "!flex-row items-center justify-between sm:!flex-col sm:items-start sm:justify-start"
              }
            >
              <div className="flex items-center justify-between self-stretch sm:mt-[10px]">
                <Switch
                  checked={notificationChecked}
                  disabled={notificationDisabled}
                  onCheckedChange={onNotificationChecked}
                />
                <div
                  className="ml-4 hidden text-[#D6D6D6] data-[checked=true]:text-white sm:block"
                  data-checked={notificationChecked}
                >
                  {T(notificationChecked ? "ON" : "OFF")}
                </div>
              </div>
            </FeatureItem>
          )
        }
       
        <SearchHistoricalTweets />
      </div>
    </div>
  );
}
