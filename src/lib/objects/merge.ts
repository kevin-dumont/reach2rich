type MergeOptions = {
  overrideArrays?: boolean;
};

export const merge = (objects: any[], options: MergeOptions = {}): any => {
  const isObject = (obj: any) => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const prevValue = prev[key];
      const objValue = obj[key];

      if (Array.isArray(prevValue) && Array.isArray(objValue)) {
        prev[key] = options.overrideArrays
          ? objValue
          : prevValue.concat(...objValue);
      } else if (isObject(prevValue) && isObject(objValue)) {
        prev[key] = merge([prevValue, objValue], options);
      } else {
        prev[key] = objValue;
      }
    });

    return prev;
  }, {});
};
