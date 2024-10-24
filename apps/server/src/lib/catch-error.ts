/**
 * Error handler function to replace try-catch blocks
 * @param promise Promise to handle
 * @param errorsToCatch List of errors to catch
 * @returns [error, data] tuple
 * @see https://www.youtube.com/watch?v=AdmGHwvgaVs&t=443s&ab_channel=WebDevSimplified
 */

export async function $catch<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      if (errorsToCatch == undefined) {
        return [error];
      }
      if (errorsToCatch.some((e) => error instanceof e)) {
        return [error];
      }
      throw error;
    });
}
