/* eslint-disable @typescript-eslint/no-explicit-any */

export const equals = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
