export const withActionCallback = <T>(
  action: (state: any, formData: FormData) => Promise<T>,
  callback: (result: T) => void
) => {
  return async (_: any, formData: FormData) => {
    const result = await action(_, formData);
    callback(result);
    return result;
  };
};
