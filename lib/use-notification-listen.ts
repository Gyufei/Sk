import { useEffect, useState } from "react";
import { useAtom } from "jotai/react";
import { NotificationAtom } from "@/lib/api/state";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { useContext } from "react";
import { GlobalMsgContext } from "@/components/global-msg-context";
import { useTranslations } from "next-intl";

export const isNotificationSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window
  
export function useNotificationListen():{
  isNotificationSupport: boolean;
  notificationChecked: boolean;
  notificationDisabled: boolean;
  levelGt2: boolean;
  onNotificationChecked: (value: boolean) => void;
} {
  const [notification, setNotification]= useAtom(NotificationAtom);
  const isNotificationSupport = isNotificationSupported();
  const { data: userInfo } = useFetchUserInfo();
  const levelGt2 = userInfo?.level >= 2;
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const T = useTranslations("Common");

  const [notificationChecked, setNotificationChecked] = useState<boolean>(notification === "ON");

  const notificationDisabled = isNotificationSupport && Notification.permission === "denied";

  useEffect(() => {
    setNotificationChecked(notification === 'ON')
  }, [notification])

  function onNotificationChecked(value: boolean) {
   
    if (value === true) {
      if (!levelGt2) {
        setGlobalMessage({
          type: "warning",
          message: T("NotionLevelRequired"),
        });
        return
      }
      if (!isNotificationSupport) {
        setNotificationChecked(true);
        setNotification("ON")
        return
      }

      if (Notification.permission === 'granted') {
        setNotificationChecked(true);
        setNotification("ON")
        return;
      }
     
      Notification.requestPermission().then(() => {
        setNotificationChecked(true);
        setNotification("ON")
      });
      return;
    }
    
    setNotification("OFF")
    setNotificationChecked(false);
  }

  return {
    isNotificationSupport,
    notificationChecked,
    onNotificationChecked,
    notificationDisabled,
    levelGt2
  }
}
