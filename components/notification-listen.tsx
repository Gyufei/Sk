"use client";
import { useAtom } from "jotai/react";
import { NotificationAtom, NotificationIdAtom } from "@/lib/api/state";
import useSWR from "swr";
import { isNotificationSupported, } from "@/lib/use-notification-listen";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useEffect } from "react";

type NotionResItem = {
  id: string;
  content: string;
  title: string;
  create_at: string;
};

function notifyMe(title: string, content: string) {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: content,
      requireInteraction: true,
      icon: '/images/logo-black.png'
    })
    return true
  }
  return false
}

export function NotificationListen() {
  const [notification, setNotification]= useAtom(NotificationAtom);
  const [notionId, setNotionId] = useAtom(NotificationIdAtom);

  useEffect(() => {
    if (!isNotificationSupported()) return;
    if (Notification.permission === "default" && notification === "ON") {
      setNotification("OFF")
    }
  }, [])


  useSWR(
    notification ? `url` : null,
    handleGetNotification,
    {
      refreshInterval: 10000
    }
  );
   
  async function handleGetNotification() {
    if (!isNotificationSupported()) return false;
    if (Notification.permission !== 'granted') return false;
    if (notification!=="ON") return;
    const res: NotionResItem[] = await fetcher(`${ApiHost}/notion`, {
      method: "GET",
    });

    if (res.length > 0) {
      const readedIds = (notionId || "").split("_");
      const newIds = (res || []).map((item) => item.id).join("_");
      setNotionId(newIds)
      const validRes = (res || []).filter((item: NotionResItem) => {
        const { create_at, id } = item;
        if (readedIds.includes(id + '')) return false
        const nowTime = new Date().getTime();
        const createTime = new Date(create_at).getTime();
        if ((nowTime - createTime) > 86400000 * 7) return false
        return true;
      })
    
      validRes.map((item: NotionResItem) => {
        const { title, content } = item;
        notifyMe(title, content)
      })
    }
  }

  return null
}
