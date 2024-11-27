import { useState } from "react";
import { useSetAtom } from "jotai/react";
import { NotificationAtom } from "@/lib/api/state";

export const isNotificationSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window
  
export function useNotificationListen():{
  isNotificationSupport: boolean;
  notificationChecked: boolean;
  notificationDisabled: boolean;
  onNotificationChecked: (value: boolean) => void;
} {
  const setNotification = useSetAtom(NotificationAtom);
  const isNotificationSupport = isNotificationSupported();

  const [notificationChecked, setNotificationChecked] = useState<boolean>(
    isNotificationSupport && Notification.permission === "granted",
  );

  const notificationDisabled = isNotificationSupport && Notification.permission === "denied";

  function onNotificationChecked(value: boolean) {
    if (value === true) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          setNotificationChecked(true);
          setNotification("true")
        } else {
          setNotification("")
        }
      });
      return;
    }
    
    setNotification("")
    setNotificationChecked(false);
  }

  return {
    isNotificationSupport,
    notificationChecked,
    onNotificationChecked,
    notificationDisabled
  }
}
