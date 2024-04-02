import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";

export const UserInfoAtom = atom<Record<string, any> | null>(null);
export const UuidAtom = atomWithStorage<string>("uuid", "");
export const LangAtom = atomWithStorage<string>("lang", "En");
