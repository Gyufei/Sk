import Image from "next/image";

import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { LastSignInWithKey, SignInMethod } from "./type";
import useSWR from "swr";
import { useTwitterSign } from "@/lib/api/use-twitter-sign";

export default function SignWithXBtn({
  signing,
  setSigning,
  lastAccount,
  show,
  onSuccess,
}: {
  signing: boolean;
  setSigning: (_i: boolean) => void;
  lastAccount: string;
  show: boolean;
  onSuccess: (_i: string) => void;
}) {
  const currentPageUrl = window.location.origin + window.location.pathname;
  const { code, goTwitter } = useTwitterSign();

  useSWR(code ? `sign-in-with-twitter:${code}` : null, postSignData);

  async function postSignData() {
    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "twitter",
          login_data: {
            code: code,
            redirect_uri: currentPageUrl,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "twitter sign in error:" + `${code}  ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.twitter,
          account: "",
        }),
      );

      setSigning(false);

      return res;
    } catch (e) {
      console.log(e);
      setSigning(false);
    }
  }

  function handleSign() {
    if (signing) return;
    goTwitter(currentPageUrl);
  }

  return (
    <button
      style={{
        display: show ? "block" : "none",
      }}
      disabled={signing}
      onClick={handleSign}
      className="mt-[20px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75"
    >
      <div className="flex w-full items-center justify-center">
        <Image
          className="mr-1"
          src="/icons/twitter.svg"
          width={20}
          height={20}
          alt=""
        />
        <div className="font-semibold">Sign in with X</div>
        {lastAccount && <div>: {lastAccount}</div>}
      </div>
    </button>
  );
}
