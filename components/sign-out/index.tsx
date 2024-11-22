import { useTranslations } from "next-intl";
import { useAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";
import Image from "next/image";

function SignOut({
  isIcon = false
}: {
  isIcon?: boolean
}) {
  const T = useTranslations("Common");
  const [uuid, setUuid] = useAtom(UuidAtom);

  function handleSignOut() {
    setUuid("");
    // 刷新当前页面
    location.reload()
  }

  if (isIcon) {
    return (
      <div className="flex h-[50px] w-[50px] mb-[15px] items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md">
      <Image
        onClick={handleSignOut}
        className="cursor-pointer"
        src="/icons/sign-out.svg"
        width={30}
        height={30}
        alt={T("SignOut")}
      />
    </div>
    )
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