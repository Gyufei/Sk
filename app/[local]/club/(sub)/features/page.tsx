"use client";
import { GoBackTo } from "@/components/go-back-to";
import { useTranslations } from "next-intl";
import DomainRedirect from "./domain-redirect";
import SearchHistoricalTweets from "./search-historical-tweets";
import FeatureItem from "./feature-item";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { BreadCrumbs } from "@/components/bread-crumbs";

export default function Page() {
  const T = useTranslations("Common");
  const [notificationChecked, setNotificationChecked] = useState<boolean>(Notification.permission === 'granted');

  function onNotificationChecked(value: boolean) {
    if (value === true) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          setNotificationChecked(true)
        }
      });
      return
    }
    const notification = new Notification('close notification');
    notification.close()
    setNotificationChecked(false)
  }

  return (
    <div className="no-scroll-bar relative content-w-600 md:-ml-[250px] m-t-20  md:trans-scroll-bar md:h-fit md:max-h-[calc(100%-70px)] overflow-y-auto">
      <div className="relative flex items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 content-w-600">
        <DomainRedirect />
        <FeatureItem title={T("Notification")}>
          <div className="md:mt-[10px] flex items-center justify-between self-stretch">
              <Switch 
                checked={notificationChecked}
                disabled={Notification.permission ==='denied'}
                onCheckedChange={onNotificationChecked}
              />
              <div className="ml-4 text-[#D6D6D6] data-[checked=true]:text-white" data-checked={notificationChecked}>{T(notificationChecked ? "ON" : "OFF")}</div>
          </div>
        </FeatureItem>
        <SearchHistoricalTweets />
      </div>
    </div>
  );
}
