/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';

export interface ICheckboxesFieldOnChangeEvent {
  (event: { field: string; value: string | null; checked: boolean }): void;
}

export interface ICheckboxesFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface ICheckboxesFieldProps {
  className?: string;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  inline?: boolean;
  label: string;
  onChange: ICheckboxesFieldOnChangeEvent;
  options: ICheckboxesFieldOption[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  values?: string[] | null;
}

const CheckboxesField = ({ className, error, field, gutterBottom, helperText, inline, label, onChange, options, required, values }: ICheckboxesFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const handleOnChange: React.FormEventHandler<Checkbox> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value, checked: target.checked });
  };

  const checkedValues = options?.map((el) => el.value).filter((value) => (values ?? []).includes(value)) ?? [];

  return (
    <FormGroup validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-8' : 'tw-mb-0'} bsSize="small">
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
      </ControlLabel>
      {options.map((option) => (
        <React.Fragment key={option.value}>
          <Checkbox value={option.value} onChange={handleOnChange} checked={checkedValues.includes(option.value)} disabled={option.disabled} className={className} inline={inline}>
            {option.text}
          </Checkbox>
          {inline && ' '}
        </React.Fragment>
      ))}
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default CheckboxesField;
