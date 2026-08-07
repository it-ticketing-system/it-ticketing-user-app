'use client';

import { SearchField } from '@heroui/react';
import { useTranslations } from 'next-intl';

type TicketSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const TicketSearchField = ({
  value,
  onChange,
  className,
}: TicketSearchFieldProps) => {
  const t = useTranslations('tickets.filters.search');

  return (
    <SearchField
      aria-label={t('ariaLabel')}
      fullWidth
      value={value}
      onChange={onChange}
      variant="secondary"
      className={className}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />

        <SearchField.Input placeholder={t('placeholder')} />

        <SearchField.ClearButton aria-label={t('clearAriaLabel')} />
      </SearchField.Group>
    </SearchField>
  );
};

export default TicketSearchField;
