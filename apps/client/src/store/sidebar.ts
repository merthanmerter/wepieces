import { atomWithStorage } from "jotai/utils";

export const SIDEBAR_DEFAULT_OPEN = true;
export const sideBarAtom = atomWithStorage<boolean>(
  "sidebar",
  SIDEBAR_DEFAULT_OPEN,
);
