import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import fetcher from "./fetcher";
import { ApiHost } from "./path";
import { usePathname, useRouter } from "@/app/navigation";
import { useAtomValue } from "jotai";
import { UuidAtom } from "./state";
import { GlobalMsgContext } from "@/components/global-msg-context";

const SendEmailKey = "sendEmail";

export function useSendEmail() {
  const { setGlobalMessage } = useContext(GlobalMsgContext);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const code = searchParams.get("verify_code");
  const email = searchParams.get("email");
  const [hasSend, setHasSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastSendTime, setLastSendTime] = useState("");
  const uuid = useAtomValue(UuidAtom);

  useEffect(() => {
    const lt = localStorage.getItem(SendEmailKey);
    if (!lt) return;
    setLastSendTime(lt);
  }, []);

  useEffect(() => {
    if (!lastSendTime) return;

    const now = new Date().getTime();
    const duration = 60 * 1000;

    const time = Number(lastSendTime);
    if (time > now - duration) {
      setHasSend(true);

      const timer = setTimeout(() => {
        setHasSend(false);
      }, duration - (now - time));

      return () => clearTimeout(timer);
    }
  }, [lastSendTime]);

  async function sendEmail(email: string, cb: string) {
    if (hasSend) return;

    setSending(true);

    setHasSend(true);
    try {
      const res: any = await fetcher(`${ApiHost}/user/send_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          redirect_uri: cb,
          user_id: uuid || "00000000-0000-0000-0000-000000000000",
        }),
      });

      if (res) {
        setHasSend(true);
        const now = new Date().getTime().toString();
        setLastSendTime(now);
        localStorage.setItem(SendEmailKey, now);

        setGlobalMessage({
          type: "success",
          message: "Email sent successfully",
        });
      }
      setSending(false);
    } catch (error) {
      setHasSend(false);
      setSending(false);
    }
  }

  function removeCode() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("verify_code");
    searchParams.delete("email");
    searchParams.delete("user_id");

    router.replace({
      pathname,
      query: Object.fromEntries(searchParams.entries()),
    });
  }

  return {
    code,
    email,
    sending,
    hasSend,
    sendEmail,
    removeCode,
  };
}
