import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { usePathname, useRouter } from "@/app/navigation";

const SendEmailKey = "sendEmail";

export function useSendEmail() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const code = searchParams.get("verify_code");
  const email = searchParams.get("email");
  const [hasSend, setHasSend] = useState(false);

  useEffect(() => {
    const lastSendTime = localStorage.getItem(SendEmailKey);
    if (!lastSendTime) return;
    const now = new Date().getTime();
    const duration = 60 * 1000;

    const time = Number(lastSendTime);
    if (time > now - duration) {
      setHasSend(true);

      setTimeout(() => {
        setHasSend(false);
      }, now - time);
    }
  }, []);

  async function sendEmail(email: string, cb: string) {
    const res: any = await fetcher(`${ApiHost}/user/send_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        callback: cb,
      }),
    });

    if (res) {
      setHasSend(true);
      localStorage.setItem(SendEmailKey, new Date().getTime().toString());
    }
  }

  function removeCode() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("verify_code");
    searchParams.delete("email");

    router.replace({
      pathname,
      query: Object.fromEntries(searchParams.entries()),
    });
  }

  return {
    code,
    email,
    hasSend,
    sendEmail,
    removeCode,
  };
}
