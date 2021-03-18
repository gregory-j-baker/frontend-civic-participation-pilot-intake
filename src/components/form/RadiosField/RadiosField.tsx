/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ControlLabel, FormGroup, HelpBlock, Radio } from 'react-bootstrap';
import { FieldErrorMessage } from '../FieldErrorMessage';

export interface RadiosFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface RadiosFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface RadiosFieldProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  inline?: boolean;
  label: string;
  labelClassName?: string;
  onChange: RadiosFieldOnChangeEvent;
  options: RadiosFieldOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

export const RadiosField = ({ className, disabled, error, field, gutterBottom, helperText, inline, label, labelClassName, onChange, options, required, value }: RadiosFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const groupName = `form-field-${field}`;

  const handleOnChange: React.FormEventHandler<Radio> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value });
  };

  const selectedValue = options.find((option) => option.value === value)?.value ?? '';

  return (
    <FormGroup className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${labelClassName} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName}`}>{t('common:field-required')}</strong>}
      </ControlLabel>
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
      {error && <FieldErrorMessage message={error} />}
      <div>
        {options.map((el) => (
          <Radio key={el.value} name={groupName} value={el.value} onChange={handleOnChange} checked={el.value === selectedValue} disabled={el.disabled || disabled} className={`${inline ? 'tw-mr-4' : ''} ${className ?? ''}`} inline={inline}>
            {el.text}
          </Radio>
        ))}
      </div>
    </FormGroup>
  );
};
