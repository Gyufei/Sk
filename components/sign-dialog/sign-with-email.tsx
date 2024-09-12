import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import fetcher from "@/lib/fetcher";
import { ApiHost } from "@/lib/path";
import { LastSignInWithKey, SignInMethod } from "./type";
import useSWR from "swr";

export default function SignWithEmail({
  signing,
  lastAccount,
  show,
  onSuccess,
}: {
  signing: boolean;
  lastAccount: string;
  show: boolean;
  onSuccess: (_i: string) => void;
}) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (lastAccount) {
      setEmail(lastAccount);
    }
  }, [lastAccount]);

  const code = searchParams.get("email");
  useSWR(code ? `sign-in-with-twitter:${code}` : null, postSignData);

  const [isValid, setIsValid] = useState(true);

  function checkRegex(x: string) {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

    return regex.test(x);
  }

  function handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      handleConfirm();
    }
  }

  function handleConfirm() {
    const valid = checkRegex(email);

    if (!valid) {
      setIsValid(false);
      return;
    }
  }

  async function postSignData() {
    try {
      const res: any = await fetcher(`${ApiHost}/user/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_type: "email",
          login_data: {
            signature: code,
          },
        }),
      });

      if (res.status === false || !res.uuid) {
        throw new Error(
          "email sign in error:" + `${email} ${code}  ${JSON.stringify(res)}`,
        );
      }

      onSuccess(res.uuid);

      localStorage.setItem(
        LastSignInWithKey,
        JSON.stringify({
          method: SignInMethod.email,
          account: email,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      style={{
        display: show ? "block" : "none",
      }}
      className="mt-[15px] w-full"
    >
      <Input
        onKeyDown={handleKeyDown}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-error={!isValid}
        className="h-12 w-full rounded-lg  border border-[rgba(255,255,255,0.6)] bg-transparent p-4 text-base data-[error=true]:border-[#FF5A5A]"
      />
      <button
        disabled={signing}
        onClick={handleConfirm}
        className="mt-[15px] flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-solid border-[rgba(255,255,255,0.6)] text-base leading-6 text-[rgba(255,255,255,0.6)] hover:brightness-75"
      >
        <div>Sign In</div>
      </button>
    </div>
  );
}
