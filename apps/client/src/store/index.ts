import { createStore } from "jotai/vanilla";
import { authAtom } from "./auth";
import { postReportAtom } from "./post-report";
import { sideBarAtom } from "./sidebar";

const store = createStore();

store.sub(authAtom, () => {});
store.sub(sideBarAtom, () => {});
store.sub(postReportAtom, () => {});

export default store;
export type JotaiStore = typeof store;
