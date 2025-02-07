import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useTranslations } from "next-intl";

export function LevelTpl() {
  const T = useTranslations("Common");
  const { data: userInfo } = useFetchUserInfo();

  return (
    <div className="flex flex-col">
      <div className="mb-1 font-haasDisp text-sm font-medium leading-6  text-[rgba(255,255,255,0.6)] text-white opacity-60 sm:text-base">
        {T("Level")}
      </div>
      <div
        className="flex items-center justify-end text-base leading-6 underline decoration-[rgba(255,255,255,0.1);] decoration-dashed underline-offset-2 hover:decoration-white"
        style={{
          cursor: userInfo?.level === 0 ? "pointer" : "default",
        }}
      >
        {` ${userInfo?.level || 0}`}
      </div>
    </div>
  );
}
