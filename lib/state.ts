import { atomWithStorage } from "jotai/utils";

export const UuidAtom = atomWithStorage<string>("uuid", "", undefined, {
  getOnInit: true,
});
