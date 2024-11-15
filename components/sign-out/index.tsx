import { useTranslations } from "next-intl";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";

function SignOut() {
  const T = useTranslations("Common");
  const [uuid, setUuid] = useAtom(UuidAtom);

  function handleSignOut() {
    setUuid("");
    // 刷新当前页面
    location.reload()
  }

  return (
    <div
      onClick={handleSignOut}
      className="normal-line-button mt-[80px] flex w-[137px] h-12 cursor-pointer items-center justify-center rounded-lg border whitespace-nowrap px-[100px] text-base leading-6 hover:bg-red-500 hover:border-none hover:text-white"
    >
      {T("SignOut")}
    </div>
  )
}

export default SignOut;