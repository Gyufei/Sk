import { useTranslations } from "next-intl";

export function NotEligible() {
  const T = useTranslations("Common");

  return (
    <div className="flex h-[208px] flex-col items-center justify-center">
      <div className="text-[40px] leading-9 text-white opacity-80">
        {T("Sorry")}
      </div>
      <div className="mt-[10px] text-center text-[28px] font-medium leading-9 text-white">
        <span className="opacity-60">{T("YouAre")}</span>
        <span className="opacity-80">{T("NotEligible")}</span>
      </div>
    </div>
  );
}
