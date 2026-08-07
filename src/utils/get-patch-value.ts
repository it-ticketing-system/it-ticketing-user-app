export const getPatchValue = <TPatch extends object, TKey extends keyof TPatch>(
  patch: TPatch,
  key: TKey,
): NonNullable<TPatch[TKey]> | '' | undefined => {
  if (!Object.prototype.hasOwnProperty.call(patch, key)) {
    return undefined;
  }

  return (patch[key] ?? '') as NonNullable<TPatch[TKey]> | '';
};
