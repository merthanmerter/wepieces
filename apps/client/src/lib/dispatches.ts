export function DispatchAction<T>(state: T, action: Partial<T>): T {
  return { ...state, ...action };
}
