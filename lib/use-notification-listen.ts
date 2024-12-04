import { useEffect, useState } from "react";
import { useAtom } from "jotai/react";
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
  const [notification, setNotification]= useAtom(NotificationAtom);
  const isNotificationSupport = isNotificationSupported();

  const [notificationChecked, setNotificationChecked] = useState<boolean>(
    isNotificationSupport && notification === "ON",
  );

  const notificationDisabled = isNotificationSupport && Notification.permission === "denied";

  useEffect(() => {
    if (!isNotificationSupported()) return;
    if (Notification.permission === "default" && notification === "ON") {
      setNotification("OFF")
    }
  }, [])

  function onNotificationChecked(value: boolean) {
    if (value === true) {
      if (Notification.permission === 'granted') {
        setNotificationChecked(true);
        setNotification("ON")
        return;
      }
     
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          setNotificationChecked(true);
          setNotification("ON")
        } else {
          setNotification("OFF")
        }
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
    notificationDisabled
  }
}
