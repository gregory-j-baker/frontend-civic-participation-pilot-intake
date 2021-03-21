/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import { FieldErrorMessage } from '../FieldErrorMessage';

export interface CheckboxesFieldOnChangeEvent {
  (event: { field: string; value: string | null; checked: boolean }): void;
}

export interface CheckboxesFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface CheckboxesFieldProps {
  children?: React.ReactNode;
  className?: string;
  error?: string;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  inline?: boolean;
  label: string;
  labelClassName?: string;
  onChange: CheckboxesFieldOnChangeEvent;
  options: CheckboxesFieldOption[];
  placeholder?: string;
  required?: boolean;
  values?: string[] | null;
}

export const CheckboxesField = ({ children, className, error, field, gutterBottom, helperText, inline, label, labelClassName, onChange, options, required, values }: CheckboxesFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const handleOnChange: React.FormEventHandler<Checkbox> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value, checked: target.checked });
  };

  const checkedValues = options?.map((el) => el.value).filter((value) => (values ?? []).includes(value)) ?? [];

  return (
    <FormGroup className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${labelClassName} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName}`}>{t('common:field-required')}</strong>}
      </ControlLabel>
      {children && <div className="tw-mb-4">{children}</div>}
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
      {error && <FieldErrorMessage message={error} />}
      <div>
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value} onChange={handleOnChange} checked={checkedValues.includes(option.value)} disabled={option.disabled} className={`${inline ? 'tw-mr-4' : ''} ${className ?? ''}`} inline={inline}>
            {option.text}
          </Checkbox>
        ))}
      </div>
    </FormGroup>
  );
};
