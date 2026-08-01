'use client';

import { Calendar, DateField, DatePicker, Label } from '@heroui/react';
import {
  GregorianCalendar,
  parseDate,
  PersianCalendar,
  toCalendar,
  type DateValue,
} from '@internationalized/date';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { I18nProvider } from 'react-aria/I18nProvider';

const PERSIAN_LOCALE = 'fa-IR-u-ca-persian';
const PERSIAN_CALENDAR = new PersianCalendar();
const GREGORIAN_CALENDAR = new GregorianCalendar();

type TicketDateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
};

const toPersianDateValue = (value?: string): DateValue | null => {
  if (!value) {
    return null;
  }

  try {
    return toCalendar(parseDate(value), PERSIAN_CALENDAR);
  } catch {
    return null;
  }
};

const toIsoDateString = (value: DateValue): string => {
  return toCalendar(value, GREGORIAN_CALENDAR).toString();
};

const TicketDateField = ({
  label,
  value,
  onChange,
  min,
  max,
}: TicketDateFieldProps) => {
  const selectedDate = useMemo(() => toPersianDateValue(value), [value]);
  const minValue = useMemo(() => toPersianDateValue(min), [min]);
  const maxValue = useMemo(() => toPersianDateValue(max), [max]);

  const handleChange = (nextValue: DateValue | null) => {
    onChange(nextValue ? toIsoDateString(nextValue) : '');
  };

  return (
    <I18nProvider locale={PERSIAN_LOCALE}>
      <DatePicker
        value={selectedDate}
        minValue={minValue ?? undefined}
        maxValue={maxValue ?? undefined}
        onChange={handleChange}
        shouldCloseOnSelect
      >
        <Label>{label}</Label>

        <DateField.Group fullWidth>
          <DateField.InputContainer>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
          </DateField.InputContainer>

          <DatePicker.Trigger aria-label={label} className="w-auto flex-none">
            <CalendarDays aria-hidden="true" className="size-5" />
          </DatePicker.Trigger>
        </DateField.Group>

        <DatePicker.Popover placement="bottom end">
          <Calendar>
            <Calendar.Header>
              <Calendar.NavButton slot="previous">
                <ChevronRight aria-hidden="true" className="size-4" />
              </Calendar.NavButton>

              <Calendar.Heading />

              <Calendar.NavButton slot="next">
                <ChevronLeft aria-hidden="true" className="size-4" />
              </Calendar.NavButton>
            </Calendar.Header>

            <Calendar.Grid weekdayStyle="short">
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>

              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
    </I18nProvider>
  );
};

export default TicketDateField;
