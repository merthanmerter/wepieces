import { Credentials } from "@app/server/src/lib/auth";
import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage<Credentials | null>("auth", null);
