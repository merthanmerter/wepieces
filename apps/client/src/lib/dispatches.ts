export function ActionDispatch<T>(state: T, action: Partial<T>): T {
  return { ...state, ...action };
}
