const timeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tehran',
});

const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tehran',
});

const relativeFormatter = new Intl.RelativeTimeFormat('fa-IR', {
  numeric: 'auto',
});

const toDayStart = (date: Date): number => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
};

export const formatPersianDateTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
};

export const formatPersianRelativeDateTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const dayDiff = Math.round(
    (toDayStart(date) - toDayStart(now)) / (24 * 60 * 60 * 1000),
  );
  const timeLabel = timeFormatter.format(date);

  return `${relativeFormatter.format(dayDiff, 'day')}\u060C ${timeLabel}`;
};
