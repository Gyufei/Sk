"use client";
import { GoBackTo } from "@/components/go-back-to";
import { useTranslations } from "next-intl";
import DomainRedirect from "./domain-redirect";
import SearchHistoricalTweets from "./search-historical-tweets";
import FeatureItem from "./feature-item";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { BreadCrumbs } from "@/components/bread-crumbs";

const isSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

export default function Page() {
  const T = useTranslations("Common");
  const isNotificationSupport = isSupported();
  const [notificationChecked, setNotificationChecked] = useState<boolean>(
    isNotificationSupport && Notification.permission === "granted",
  );

  function onNotificationChecked(value: boolean) {
    if (value === true) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          setNotificationChecked(true);
        }
      });
      return;
    }
    const notification = new Notification("close notification");
    notification.close();
    setNotificationChecked(false);
  }

  return (
    <div className="no-scroll-bar content-w-600 m-t-20 md:trans-scroll-bar relative  overflow-y-auto md:-ml-[250px] md:h-fit md:max-h-[calc(100%-70px)]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="content-w-600 mb-[20px] mt-6 content-bg-blur">
        <DomainRedirect />
        {
          isNotificationSupport && (
            <FeatureItem
              title={T("Notification")}
              className={
                "!flex-row items-center justify-between sm:!flex-col sm:items-start sm:justify-start"
              }
            >
              <div className="flex items-center justify-between self-stretch md:mt-[10px]">
                <Switch
                  checked={notificationChecked}
                  disabled={Notification.permission === "denied"}
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
