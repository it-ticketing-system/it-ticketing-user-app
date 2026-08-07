type SearchParams = Record<string, string | string[] | undefined>;

export const getSearchParamValue = (
  searchParams: SearchParams,
  key: string,
): string => {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};
