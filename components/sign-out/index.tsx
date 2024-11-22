import { useTranslations } from "next-intl";
import { useSetAtom } from "jotai/react";
import { UuidAtom } from "@/lib/api/state";

function SignOut() {
  const T = useTranslations("Common");
  const setUuid = useSetAtom(UuidAtom);

  function handleSignOut() {
    setUuid("");
    location.reload();
  }

  return (
    <div
      onClick={handleSignOut}
      className="normal-line-button mt-[80px] flex h-12 w-[137px] cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border px-[100px] text-base leading-6 hover:border-none hover:bg-red-500 hover:text-white"
    >
      {T("SignOut")}
    </div>
  );
}

export default SignOut;
