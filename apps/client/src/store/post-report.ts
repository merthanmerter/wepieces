import { atom } from "jotai/vanilla";

/**
 * Defines `postReportAtom`, an atom that manages
 * custom parameters (year and month) for use in
 * the loader function.
 *
 * - The atom is subscribed to the store in:
 *   `./src/store/index.ts`
 * - Defaults: current year and month
 *   (e.g., `{ year: 2024, month: 10 }`)
 *
 * @file './src/store/index.ts'
 */
export const postReportAtom = atom<{
  year: number;
  month: number;
}>({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
});
