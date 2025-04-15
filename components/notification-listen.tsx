"use client";
import { useAtom, useAtomValue } from "jotai/react";
import { NotificationAtom, NotificationIdAtom } from "@/lib/api/state";
import { isNotificationSupported } from "@/lib/use-notification-listen";
import { ApiSocket } from "@/lib/api/path";
import { useEffect, useRef, useState } from "react";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { ToastModal } from "./toast-modal";
import { ToastProvider, ToastViewport } from "./ui/toast";
import { useTranslations } from "next-intl";
import { timestampToTime } from "@/lib/utils/utils";
import { useNotificationListen } from "@/lib/use-notification-listen";
import { WebsocketController } from "@/lib/utils/websocket";

type NotionResItem = {
  id: string;
  content: string;
  title: string;
  create_at: string;
  image?: string;
};

type ToastContentType = NotionResItem;

export function NotificationListen() {
  const notification = useAtomValue(NotificationAtom);
  const [notionId, setNotionId] = useAtom(NotificationIdAtom);
  const { data: userInfo } = useFetchUserInfo();

  const [open, setOpen] = useState<boolean>(false);
  const [pageStartTime, setPageStartTime] = useState<number>(
    new Date().getTime(),
  );
  const [toastContent, setToastContent] = useState<
    ToastContentType | undefined
  >(undefined);
  const [toastImage, setToastImage] = useState<string>();
  const cycleTitleT = useRef(0);
  const T = useTranslations("Common");

  const noteInfo = useRef({
    levelGt2: userInfo?.level >= 2,
    notification: notification,
    notionId,
  });

  noteInfo.current = {
    levelGt2: userInfo?.level >= 2,
    notification: notification,
    notionId,
  };

  const { onNotificationChecked } = useNotificationListen();

  useEffect(() => {
    setPageStartTime(new Date().getTime());

    return () => {
      stopCycleTitle();
    };
  }, []);

  useEffect(() => {
    // init notification state force to ON
    if (noteInfo.current?.levelGt2 && notification != "ON") {
      onNotificationChecked(true);
    }

    if (noteInfo.current.levelGt2 === false) {
      onNotificationChecked(false);
    }
  }, [noteInfo.current?.levelGt2]);

  useEffect(() => {
    // notifyMe({
    //   id: "1",
    //   create_at: "1714857600",
    //   title: "title-title-tiele",
    //   content: `test for test test for test`,
    //   image:
    //     "http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg",
    // });
    const notionWebsocket = new WebsocketController(ApiSocket);
    // Add a custom event handler
    notionWebsocket.execute({ type: "data", content: "Hello, WebSocket!" });
    notionWebsocket.addEvent("notionListen", (event: MessageEvent) => {
      const data = JSON.parse(event.data || "[]");
      handleGetNotification(data as NotionResItem[]);
    });

    return () => {
      // Later, you can stop the heartbeat and disconnect the WebSocket
      if (notionWebsocket) {
        notionWebsocket.stopHeartbeat();
        notionWebsocket.disconnectWebSocket();
        notionWebsocket.removeEvent("notionListen");
      }
    };
  }, []);

  function cycleTitle() {
    if (cycleTitleT.current > 0) return;
    cycleTitleT.current = window.setInterval(() => {
      const titleStr = T("NewNotification") + "-Juu17 Brands";
      if (document.title === titleStr) {
        document.title = "Juu17 Brands";
      } else {
        document.title = titleStr;
      }
    }, 1000);
  }

  function stopCycleTitle() {
    if (cycleTitleT.current) clearInterval(cycleTitleT.current);
    cycleTitleT.current = 0;
    document.title = "Juu17 Brands";
  }

  function notifyMe(item: NotionResItem) {
    const { title, content } = item;
    const link = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLAnchorElement;
    if (link) link.href = "/images/brands/favicon-notion-32x32.png";
    cycleTitle();
    setToastContent({
      ...item,
      create_at: timestampToTime(item.create_at),
    });
    setOpen(true);

    if (item.image) {
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        setToastImage(item.image);
      };
      img.onerror = () => {
        setToastImage("");
      };
    } else {
      setToastImage("");
    }

    if (isNotificationSupported() && Notification.permission === "granted") {
      new Notification(title, {
        body: content,
        requireInteraction: true,
        icon: "/images/brands/logo-black.png",
      });
      return true;
    }
    return false;
  }

  function handleClose() {
    setOpen(false);
    stopCycleTitle();
    const link = document.querySelector(
      "link[rel*='icon']",
    ) as HTMLAnchorElement;
    if (link) link.href = "/images/favicon-32x32.png";
  }

  async function handleGetNotification(res: NotionResItem[]) {
    if (!noteInfo.current.levelGt2) return false;
    if (noteInfo.current.notification !== "ON") return;
    if (res.length > 0) {
      const readedIds = (noteInfo.current.notionId || "").split("_");
      const newIds = (res || []).map((item) => item.id).join("_");
      setNotionId(newIds);
      const newRes = [...res].reverse();
      const validRes = newRes.filter((item: NotionResItem) => {
        const { create_at, id } = item;
        const createdTime = new Date(Number(create_at)).getTime();
        if (createdTime - pageStartTime < 0) return false;
        if (readedIds.includes(id + "")) return false;
        return true;
      });

      validRes.map((item: NotionResItem) => {
        notifyMe(item);
      });
    }
  }

  if (!toastContent) return null;

  return (
    <ToastProvider>
      <ToastModal
        iconImage={"notion"}
        {...toastContent}
        description={
          <div className="flex max-h-[calc(100vh-110px)] flex-col">
            <div className="trans-scroll-bar flex-1 overflow-auto whitespace-pre-wrap pr-1 text-[#d6d6d6]">
              {toastContent.content}
              {toastImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={toastImage}
                  width={80}
                  height={80}
                  alt=""
                  className="mt-[15px] w-full rounded-[16px]"
                  onError={() => {
                    setToastImage("");
                  }}
                />
              )}
            </div>
            <div className="flex flex-col">
              <div className="mt-[10px] text-sm text-white opacity-40">
                {T("PostedAt")}: {toastContent.create_at}
              </div>
              <div
                className="normal-line-button mt-[15px]  h-12  w-full cursor-pointer justify-center rounded-[8px] text-center align-middle font-semibold leading-[48px]"
                onClick={handleClose}
              >
                {T("NotificationOK")}
              </div>
            </div>
          </div>
        }
        open={open}
        onCloseClick={handleClose}
      />
      <ToastViewport />
    </ToastProvider>
  );
}
