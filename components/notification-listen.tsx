"use client";
import { useAtom } from "jotai/react";
import { NotificationAtom, NotificationIdAtom } from "@/lib/api/state";
import useSWR from "swr";
import { isNotificationSupported, } from "@/lib/use-notification-listen";
import fetcher from "@/lib/api/fetcher";
import { ApiHost, ApiSocket } from "@/lib/api/path";
import { useEffect, useRef, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { ToastModal } from "./toast-modal";
import { ToastProvider, ToastViewport } from "./ui/toast";
import { useTranslations } from "next-intl";
import { timestampToTime } from "@/lib/utils/utils";
import { useNotificationListen } from "@/lib/use-notification-listen";

type NotionResItem = {
  id: string;
  content: string;
  title: string;
  create_at: string;
  image?: string;
};

type ToastContentType = NotionResItem;



export function NotificationListen() {
  const [notification, setNotification]= useAtom(NotificationAtom);
  const [notionId, setNotionId] = useAtom(NotificationIdAtom);
  const { data: userInfo } = useFetchUserInfo();
  const levelGt2Ref = useRef(userInfo?.level >= 2);
  levelGt2Ref.current = userInfo?.level >= 2;
  const [open, setOpen] = useState<boolean>(false)
  const [pageStartTime, setPageStartTime] = useState<number>(new Date().getTime())
  const [toastContent, setToastContent] = useState<ToastContentType | undefined>(undefined);
  const [toastImage, setToastImage] = useState<string>();
  const cycleTitleT = useRef(0);
  const T = useTranslations("Common");
  const [isConnected, setIsConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    onNotificationChecked
  } = useNotificationListen()

  
  useEffect(() => {
    setPageStartTime(new Date().getTime());
    return () => {
      stopCycleTitle()
    }
  }, [])

  useEffect(() => {
    // init notifition state force to ON 
    if (levelGt2Ref.current && notification !="ON") {
      onNotificationChecked(true)
    }
    if (!levelGt2Ref.current) {
      onNotificationChecked(false)
    }
  }, [levelGt2Ref.current])


  function connectWebSocket() {
    const webSocket = new WebSocket(ApiSocket);

    webSocket.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connection established');
      startHeartbeat();
    };

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data || "[]");
      handleGetNotification(data as NotionResItem[])
    };

    webSocket.onclose = () => {
      setIsConnected(false);
      stopHeartbeat();
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    webSocketRef.current = webSocket;
  };

  const disconnectWebSocket = () => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
  };

  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
      stopHeartbeat();
    };
  }, []);

  function cycleTitle() {
    if (cycleTitleT.current > 0) return;
    cycleTitleT.current = window.setInterval(() => {
      const titleStr = T("NewNotification") + "-Juu17 Brands";
      if (document.title === titleStr) {
        document.title = "Juu17 Brands"
      } else {
        document.title = titleStr
      }
    }, 1000)
  }

  function stopCycleTitle() {
    if (cycleTitleT.current) clearInterval(cycleTitleT.current);
    cycleTitleT.current = 0;
    document.title = "Juu17 Brands";
  }

  function notifyMe(item: NotionResItem) {
    const { title, content, } = item;
    const link =  document.querySelector("link[rel*='icon']") as HTMLAnchorElement;
    if (link) link.href = "/images/favicon-notion-32x32.png";
    cycleTitle()
    setToastContent({
      ...item,
      create_at: timestampToTime(item.create_at),
    })
    setOpen(true)
   
    if (item.image) {
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        setToastImage(item.image)
      };
      img.onerror = () => {
        setToastImage("")
      };
    } else {
      setToastImage("")
    } 
    if (isNotificationSupported() && Notification.permission === 'granted') {
      new Notification(title, {
        body: content,
        requireInteraction: true,
        icon: '/images/logo-black.png'
      })
      return true
    }
    return false
  }

  function handleClose() {
    setOpen(false)
    stopCycleTitle();
    const link =  document.querySelector("link[rel*='icon']") as HTMLAnchorElement;
    if (link) link.href = "/images/favicon-32x32.png"
  }
  async function handleGetNotification(res: NotionResItem[]) {
    if (!levelGt2Ref.current) return false;
    if (notification!=="ON") return;
    if (res.length > 0) {
      const readedIds = (notionId || "").split("_");
      const newIds = (res || []).map((item) => item.id).join("_");
      setNotionId(newIds);
      const newRes = ([...res]).reverse()
      const validRes = newRes.filter((item: NotionResItem) => {
        const { create_at, id } = item;
        const createdTime = new Date(Number(create_at)).getTime();
        if (createdTime - pageStartTime  < 0) return false;
        if (readedIds.includes(id + '')) return false;
        return true;
      })
    
      validRes.map((item: NotionResItem) => {
        notifyMe(item)
      })
    }
  }

  if (!toastContent) return null;
  return (
    <ToastProvider>
      <ToastModal
        iconImage={'notion'}
        {...toastContent}
        description={(
          <div>
            <div className="text-[#d6d6d6] whitespace-pre-wrap">
              {toastContent.content}
              {
                toastImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={toastImage}
                    width={80}
                    height={80}
                    alt=""
                    className="rounded-[16px] mt-[15px] w-full"
                    onError={() => {
                      setToastImage("")
                    }}
                  />
                )
              }
            </div>
            <div className="text-sm mt-[10px] text-white opacity-40" >{T("PostedAt")}: {toastContent.create_at}</div>
            <div className="w-full normal-line-button  mt-[15px]  h-12 leading-[48px] rounded-[8px] text-center cursor-pointer justify-center font-semibold align-middle" onClick={handleClose}>{T("NotificationOK")}</div>
          </div> 
        )}
        open={open}
        onCloseClick={handleClose}
      />
      <ToastViewport />
    </ToastProvider>
  )
}
