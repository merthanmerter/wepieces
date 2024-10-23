import { createStore } from "jotai/vanilla";
import { authAtom } from "./auth";
import { sideBarAtom } from "./sidebar";

const store = createStore();

store.sub(authAtom, () => {});
store.sub(sideBarAtom, () => {});

export default store;
export type JotaiStore = typeof store;
