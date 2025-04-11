"use client";
import { useLocale, useTranslations } from "next-intl";
import CircleText from "./circle-text";
import { cycleWords } from "@/lib/const/text";

export default function BrandsDisplay() {
  const locale = useLocale();
  const T = useTranslations("Common");
  const words = cycleWords[locale as keyof typeof cycleWords];

  return (
    <>
      <div className="text-center text-2xl font-medium leading-[36px] text-[#D6D6D6] sm:text-3xl sm:leading-[60px]">
        {T("SloganText")}
      </div>
      <div className="text-center text-[48px] font-medium leading-[72px] sm:text-[66px] sm:leading-[66px]">
        Juu17 Brands
      </div>
      <div className="mt-[40px] flex items-center justify-center text-[20px] font-medium leading-[30px] sm:mt-[100px] sm:text-[24px] sm:leading-[36px]">
        <div className="opacity-60">{T("CycleTextPrefix")}</div>{" "}
        <CircleText words={words} />
      </div>
    </>
  );
}
