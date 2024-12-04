import { atomWithStorage } from "jotai/utils";

export const UuidAtom = atomWithStorage<string>("uuid", "", undefined, {
  getOnInit: true,
});

export const NotificationAtom = atomWithStorage<string>("notification", "", undefined, {
  getOnInit: true,
});

export const NotificationIdAtom = atomWithStorage<string>("notificationId", "", undefined, {
  getOnInit: true,
});
