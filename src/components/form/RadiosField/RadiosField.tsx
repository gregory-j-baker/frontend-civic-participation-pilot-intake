/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ControlLabel, FormGroup, HelpBlock, Radio } from 'react-bootstrap';

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
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  inline?: boolean;
  label: string;
  onChange: RadiosFieldOnChangeEvent;
  options: RadiosFieldOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

const RadiosField = ({ className, error, field, gutterBottom, helperText, inline, label, onChange, options, required, value }: RadiosFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const groupName = `form-radios-field-${field}`;

  const handleOnChange: React.FormEventHandler<Radio> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value });
  };

  const selectedValue = options?.find((option) => option.value === value)?.value ?? '';

  return (
    <FormGroup validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-2">{t('common:field-required')}</strong>}
      </ControlLabel>
      <div>
        {options.map((option) => (
          <Radio key={option.value} name={groupName} value={option.value} onChange={handleOnChange} checked={option.value === selectedValue} disabled={option.disabled} className={`${inline ? 'tw-mr-4' : ''} ${className}`} inline={inline}>
            {option.text}
          </Radio>
        ))}
      </div>
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default RadiosField;
