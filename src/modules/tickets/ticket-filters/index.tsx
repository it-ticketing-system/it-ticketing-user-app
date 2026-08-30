'use client';

import { Button, Popover } from '@heroui/react';
import { CalendarDays, ChevronDown, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/utils';
import TicketDateField from './ticket-date-field';
import TicketFilterSelect from './ticket-filter-select';
import {
  createTicketFilterPatch,
  getDateRangeLabel,
  type TicketFiltersPatch,
  type TicketFiltersValue,
} from './ticket-filters.shared';
import TicketMobileFilters from './ticket-mobile-filters';
import TicketSearchControl from './ticket-search-control';
import type { IDepartmentLookup } from '@/models';

type MyTicketsFiltersProps = {
  departments: IDepartmentLookup[];
  value: TicketFiltersValue;
  isPending: boolean;
  onChange: (patch: TicketFiltersPatch) => void;
};

const MyTicketsFilters = ({
  departments,
  value,
  isPending,
  onChange,
}: MyTicketsFiltersProps) => {
  const t = useTranslations('tickets.filters');
  const { isDesktop } = useMediaQuery();
  const { search, status, department, from, to } = value;

  const statusOptions: readonly SelectOption<string>[] = [
    { value: '', label: t('status.all') },
    { value: 'open', label: t('statuses.open') },
    { value: 'inProgress', label: t('statuses.inProgress') },
    { value: 'waitingUser', label: t('statuses.waitingUser') },
    { value: 'resolved', label: t('statuses.resolved') },
    { value: 'closed', label: t('statuses.closed') },
  ];

  const departmentOptions = [
    {
      value: '',
      label: t('department.all'),
    },
    ...departments.map((item) => ({
      value: item.id,
      label: item.name,
    })),
  ];

  const activeFilterCount =
    Number(Boolean(status)) +
    Number(Boolean(department)) +
    Number(Boolean(from || to));

  const handleStatusChange = (value: string) => {
    onChange(createTicketFilterPatch('status', value));
  };

  const handleDepartmentChange = (value: string) => {
    onChange(createTicketFilterPatch('department', value));
  };

  const handleFromDateChange = (value: string) => {
    onChange(createTicketFilterPatch('from', value));
  };

  const handleToDateChange = (value: string) => {
    onChange(createTicketFilterPatch('to', value));
  };

  const resetDateRange = () => {
    onChange({
      from: null,
      to: null,
    });
  };

  const dateRangeLabel = getDateRangeLabel({
    from,
    to,
    emptyLabel: t('dateRange.buttonLabel'),
    fromPrefix: t('dateRange.fromPrefix'),
    toPrefix: t('dateRange.toPrefix'),
  });

  const searchControl = (
    <TicketSearchControl
      querySearch={search}
      onSearchChange={(nextSearch) => {
        onChange({
          search: nextSearch || null,
        });
      }}
      className="min-w-0"
    />
  );

  if (isDesktop === null) {
    return (
      <>
        <section
          aria-hidden="true"
          className="flex items-center gap-3 lg:hidden"
        >
          <div className="border-border bg-primary-50 h-11 min-w-0 flex-1 rounded-md border" />
          <div className="border-border bg-primary-50 size-11 shrink-0 rounded-md border" />
        </section>

        <section
          aria-hidden="true"
          className="border-border bg-surface hidden gap-4 rounded-xl border p-4 shadow-sm lg:grid lg:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_176px_112px]"
        >
          <div className="border-border bg-primary-50 h-11 rounded-md border lg:col-span-2 xl:col-span-1" />
          <div className="border-border bg-primary-50 h-11 rounded-md border" />
          <div className="border-border bg-primary-50 h-11 rounded-md border" />
          <div className="border-border bg-primary-50 h-11 rounded-md border" />
        </section>
      </>
    );
  }

  return (
    <>
      {!isDesktop && (
        <section aria-label={t('sectionAriaLabel')}>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">{searchControl}</div>

            <TicketMobileFilters
              status={status}
              department={department}
              from={from}
              to={to}
              activeFilterCount={activeFilterCount}
              departmentOptions={departmentOptions}
              isPending={isPending}
              statusOptions={statusOptions}
              onApplyFilters={onChange}
            />
          </div>
        </section>
      )}

      {isDesktop && (
        <section
          aria-label={t('sectionAriaLabel')}
          className="border-border bg-surface grid gap-4 rounded-xl border p-4 shadow-sm lg:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_176px]"
        >
          <div className="min-w-0 lg:col-span-2 xl:col-span-1">
            {searchControl}
          </div>

          <TicketFilterSelect
            ariaLabel={t('status.ariaLabel')}
            placeholder={t('status.placeholder')}
            value={status}
            options={statusOptions}
            onChange={handleStatusChange}
          />

          <TicketFilterSelect
            ariaLabel={t('department.ariaLabel')}
            placeholder={t('department.placeholder')}
            value={department}
            options={departmentOptions}
            onChange={handleDepartmentChange}
          />

          <Popover>
            <Popover.Trigger>
              <Button
                variant="outline"
                size="md"
                className="border-field-border bg-field text-body-sm h-11 w-full justify-between rounded-md px-3 font-normal"
              >
                <CalendarDays
                  aria-hidden="true"
                  className={cn('text-muted shrink-0', ICON_SIZE_CLASS.md)}
                />

                <span className="min-w-0 flex-1 truncate">
                  {dateRangeLabel}
                </span>

                <ChevronDown
                  aria-hidden="true"
                  className={cn('text-muted shrink-0', ICON_SIZE_CLASS.sm)}
                />
              </Button>
            </Popover.Trigger>

            <Popover.Content
              placement="bottom end"
              offset={8}
              className="border-border bg-surface rounded-xl border shadow-lg"
            >
              <Popover.Dialog dir="rtl" className="w-90 space-y-4 p-4">
                <div>
                  <Popover.Heading className="text-title">
                    {t('dateRange.heading')}
                  </Popover.Heading>

                  <p className="text-caption text-muted mt-1">
                    {t('dateRange.description')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <TicketDateField
                    label={t('dateRange.from')}
                    value={from}
                    max={to || undefined}
                    onChange={handleFromDateChange}
                  />

                  <TicketDateField
                    label={t('dateRange.to')}
                    value={to}
                    min={from || undefined}
                    onChange={handleToDateChange}
                  />
                </div>

                {from || to ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={resetDateRange}
                    className="text-danger h-10"
                  >
                    <RotateCcw
                      aria-hidden="true"
                      className={ICON_SIZE_CLASS.sm}
                    />
                    {t('dateRange.clear')}
                  </Button>
                ) : null}
              </Popover.Dialog>
            </Popover.Content>
          </Popover>

        </section>
      )}
    </>
  );
};

export default MyTicketsFilters;
