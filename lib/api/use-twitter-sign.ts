import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/app/navigation";

export function useTwitterSign() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  function goTwitter(cb: string) {
    window.location.href =
      process.env.NODE_ENV === "production"
        ? `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access%20space.read&state=state&code_challenge=challenge&code_challenge_method=plain`
        : `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=NlF6aWE5Yk9kU1hfQUl2bkhLX1Y6MTpjaQ&redirect_uri=${cb}&scope=users.read%20tweet.read%20offline.access%20space.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
  }

  function removeXVerifyCode() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("code");
    searchParams.delete("error");
    searchParams.delete("state");

    router.replace({
      pathname,
      query: Object.fromEntries(searchParams.entries()),
    });
  }

  return {
    code,
    error,
    goTwitter,
    removeXVerifyCode,
  };
}
