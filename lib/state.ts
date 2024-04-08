import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";

export const UserInfoAtom = atom<Record<string, any> | null>(null);
export const UuidAtom = atomWithStorage<string>("uuid", "");
