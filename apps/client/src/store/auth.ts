import { Credentials } from "@server/lib/auth";
import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage<Credentials | null>("auth", null);
