import { formatPersianDate } from '@/utils';

export type FilterDraft = {
  status: string;
  department: string;
  from: string;
  to: string;
};

export type TicketFiltersValue = FilterDraft & {
  search: string;
};

export type TicketFiltersPatch = Partial<
  Record<keyof TicketFiltersValue, string | null>
>;

type DateRangeLabelParams = {
  from: string;
  to: string;
  emptyLabel: string;
  fromPrefix: string;
  toPrefix: string;
};

export const EMPTY_FILTER_DRAFT: FilterDraft = {
  status: '',
  department: '',
  from: '',
  to: '',
};

export const EMPTY_TICKET_FILTERS: TicketFiltersValue = {
  search: '',
  ...EMPTY_FILTER_DRAFT,
};

export const createTicketFilterPatch = (
  key: keyof FilterDraft,
  value: string,
): TicketFiltersPatch => ({
  [key]: value || null,
});

export const getDateRangeLabel = ({
  from,
  to,
  emptyLabel,
  fromPrefix,
  toPrefix,
}: DateRangeLabelParams): string => {
  if (from && to) {
    return `${formatPersianDate(from)} ${toPrefix} ${formatPersianDate(to)}`;
  }

  if (from) {
    return `${fromPrefix} ${formatPersianDate(from)}`;
  }

  if (to) {
    return `${toPrefix} ${formatPersianDate(to)}`;
  }

  return emptyLabel;
};
