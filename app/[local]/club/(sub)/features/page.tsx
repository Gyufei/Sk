"use client";
import { GoBackTo } from "@/components/go-back-to";
import { useTranslations } from "next-intl";
import DomainRedirect from "./domain-redirect";
import SearchHistoricalTweets from "./search-historical-tweets";
import FeatureItem from "./feature-item";
import { Switch } from "@/components/ui/switch";

export default function Page() {
  const T = useTranslations("Common");

  return (
    <div className="relative content-w-600 m-t-20 ">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 content-w-600 ">
        <DomainRedirect />
        <FeatureItem title={T("Notification")}>
          <div className="md:mt-[10px] flex items-center justify-between self-stretch">
              <Switch />
              <div className="ml-4 text-[#D6D6D6] data-[checked=true]:text-white" data-checked="false">OFF</div>
          </div>
        </FeatureItem>
        <SearchHistoricalTweets />
      </div>
    </div>
  );
}
