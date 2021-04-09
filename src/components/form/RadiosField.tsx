/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ChangeEventHandler } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { FieldErrorMessage } from './FieldErrorMessage';
import { FieldHelpBlock } from './FieldHelpBlock';

export type RadiosFieldOnChangeEvent = (event: { field: string; value: string | null }) => void;

export interface RadiosFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface RadiosFieldProps {
  children?: React.ReactNode;
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

export const RadiosField = ({ children, className, disabled, error, field, gutterBottom, helperText, inline, label, labelClassName, onChange, options, required, value }: RadiosFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const fieldId = `form-field-${field}`;
  const groupName = `form-field-group-${field}`;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value });
  };

  const selectedValue = options.find((option) => option.value === value)?.value ?? '';

  return (
    <div className={`form-group ${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}`}>
      <label id={fieldId + '-label'} htmlFor={fieldId} className={`control-label tw-w-full tw-mb-1 ${labelClassName ?? ''} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName ?? ''}`}>{t('common:field-required')}</strong>}
        {children && <div className="tw-my-2">{children}</div>}
        {error && <FieldErrorMessage message={error} />}
      </label>
      {helperText && <FieldHelpBlock id={fieldId + '-help-text'}>{helperText}</FieldHelpBlock>}
      <div>
        {options.map((el, idx) => {
          const id = idx === 0 ? fieldId : `${fieldId}-${idx + 1}`;
          return (
            <label key={el.value} htmlFor={id} className={`${inline ? 'tw-mr-4 radio-inline' : ''} ${className ?? ''}`}>
              <input type="radio" id={id} aria-describedby={idx === 0 && helperText ? fieldId + '-help-text' : undefined} name={groupName} value={el.value} onChange={handleOnChange} checked={el.value === selectedValue} disabled={el.disabled || disabled} />
              {el.text}
            </label>
          );
        })}
      </div>
    </div>
  );
};
