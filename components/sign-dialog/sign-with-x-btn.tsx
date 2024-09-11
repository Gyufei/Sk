import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LastSignInWithKey, SignInMethod } from "./type";
import useSWRMutation from "swr/mutation";

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
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("code")) return;

    const code = searchParams.get("code");
    mutation(code as any);
  });

  async function postSignData(_key: string, { arg }: { arg: string }) {
    setSigning(true);

    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "twitter",
          login_data: {
            signature: arg,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "twitter sign in error:" + `${arg}  ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.twitter,
          account: res.uuid,
        }),
      );
      setSigning(false);

      return res;
    } catch (e) {
      console.log(e);
      setSigning(false);
    }
  }

  const { trigger: mutation } = useSWRMutation(
    `sign-in-with-twitter`,
    postSignData,
  );

  function handleSign() {
    if (signing) return;
    goTwitter();
  }

  function goTwitter() {
    window.location.href =
      "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=https://juu17-api-dev.vercel.app/twitter/callback&scope=users.read%20tweet.read%20offline.access%20space.read&state=state&code_challenge=challenge&code_challenge_method=plain";
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
