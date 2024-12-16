import { useContext, useEffect, useMemo, useState } from "react";
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
  
  const emailMsg = searchParams.get("email_msg");
  const [hasSend, setHasSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastSendTime, setLastSendTime] = useState("");
  const [seconds, setSeconds] = useState(60);
  const uuid = useAtomValue(UuidAtom);

  const { code, email } = useMemo(() => {
    if (!emailMsg) {
      return { code: '', email: ''}
    }
    try {
      const emailMsgObj = JSON.parse(window.atob(emailMsg || '') || "{}")
      return {
        code: emailMsgObj?.["verify_code"],
        email: emailMsgObj?.["email"],
      }
    } catch {
      console.error("error email msg");
      return { code: '', email: ''}
    }
  }, [emailMsg])

  useEffect(() => {
    const lt = localStorage.getItem(SendEmailKey);
    if (!lt) return;
    setLastSendTime(lt);
  }, []);

  useEffect(() => {
    if (!lastSendTime) {
      setSeconds(60);
      return;
    }

    const now = new Date().getTime();
    const duration = 60 * 1000;

    const time = Number(lastSendTime);
     if (time > now - duration) {
        let startTime = Math.ceil((time - (now - duration)) / 1000);
        setSeconds(startTime)
        setHasSend(true);
        const timer = setInterval(() => {
          if (startTime === 0) {
            clearInterval(timer); 
            setHasSend(false);
          }
          setSeconds(startTime--);
      }, 1000);
      return () => clearInterval(timer);
     }
    
  }, [lastSendTime]);
 

  async function sendEmail(email: string, cb: string) {
    if (hasSend) return;

    setSending(true);

    setHasSend(true);
    setSeconds(60)
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
    seconds
  };
}
