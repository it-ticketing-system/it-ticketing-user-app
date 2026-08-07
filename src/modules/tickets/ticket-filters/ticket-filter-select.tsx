'use client';

import { Label, ListBox, Select } from '@heroui/react';
import { ChevronDown } from 'lucide-react';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';

type TicketFilterSelectProps = {
  value: string;
  placeholder: string;
  ariaLabel: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

const TicketFilterSelect = ({
  value,
  placeholder,
  ariaLabel,
  options,
  onChange,
  label,
  className,
}: TicketFilterSelectProps) => {
  return (
    <Select
      aria-label={label ? undefined : ariaLabel}
      fullWidth
      value={value || null}
      onChange={(nextValue) => {
        onChange(nextValue === null ? '' : String(nextValue));
      }}
      placeholder={placeholder}
      variant="secondary"
      className={cn('min-w-0', className)}
    >
      {label ? <Label>{label}</Label> : null}

      <Select.Trigger>
        <Select.Value />

        <Select.Indicator>
          <ChevronDown aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
        </Select.Indicator>
      </Select.Trigger>

      <Select.Popover placement="bottom end">
        <ListBox aria-label={ariaLabel}>
          {options.map((option) => (
            <ListBox.Item
              key={option.value}
              id={option.value}
              textValue={option.label}
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>

              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default TicketFilterSelect;
