export const toPositiveInteger = (value: string): number | undefined => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
};
