"use client";
import { useAtom, useAtomValue } from "jotai/react";
import { NotificationAtom, UuidAtom } from "@/lib/api/state";
import useSWR from "swr";
import { isNotificationSupported, useNotificationListen } from "@/lib/use-notification-listen";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useEffect } from "react";

function notifyMe(title: string, content: string) {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: content,
      requireInteraction: true,
      icon: ''
    })
    return true
  }
  return false
}

export function NotificationListen() {
  const [notification, setNotification]= useAtom(NotificationAtom);
  const uuid = useAtomValue(UuidAtom);
  const { notificationChecked }= useNotificationListen()

  useEffect(() => {
    setNotification(notificationChecked ? "true" : "")
  }, [])


  useSWR(
    notification ? `url` : null,
    handleGetNotification,
    {
      refreshInterval: 10000
    }
  );
  
  async function handleGetNotification() {
    if (!notification) return;
    const res: any = await fetcher(`${ApiHost}/user/claim_markle_proof`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
      }),
    });
    if (res.length > 0) {

      res.map((item: any) => {
        const { title, content } = item;
        notifyMe(title, content)
      })
    }
  }

  return null
}
