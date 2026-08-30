'use client';

import {
  Button,
  FieldError,
  InputGroup,
  Label,
  TextField,
} from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  isDisabled?: boolean;
  maxLength?: number;
  forceMasked?: boolean;
}

const PasswordField = ({
  label,
  placeholder,
  registration,
  error,
  autoComplete,
  showPasswordLabel,
  hidePasswordLabel,
  isDisabled = false,
  maxLength,
  forceMasked = false,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const visibilityLabel = isVisible ? hidePasswordLabel : showPasswordLabel;
  const VisibilityIcon = isVisible ? EyeOff : Eye;

  return (
    <TextField fullWidth isInvalid={Boolean(error)}>
      <Label>{label}</Label>

      <InputGroup fullWidth variant="secondary">
        <InputGroup.Input
          {...registration}
          type={forceMasked || !isVisible ? 'password' : 'text'}
          autoComplete={autoComplete}
          disabled={isDisabled}
          maxLength={maxLength}
          placeholder={placeholder}
        />

        <InputGroup.Suffix>
          <Button
            type="button"
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={visibilityLabel}
            isDisabled={isDisabled}
            onPress={() => setIsVisible((current) => !current)}
          >
            <VisibilityIcon aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>

      <FieldError>{error}</FieldError>
    </TextField>
  );
};

export default PasswordField;
