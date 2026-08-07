const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatPersianDate = (value: string): string => {
  if (!value) {
    return '';
  }

  try {
    return persianDateFormatter.format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
};
