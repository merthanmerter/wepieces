import { createStore } from "jotai/vanilla";
import { authAtom, authRevalidateIntervalStore } from "./auth";

const store = createStore();

store.sub(authAtom, () => {});
store.sub(authRevalidateIntervalStore, () => {});

export default store;
export type JotaiStore = typeof store;
