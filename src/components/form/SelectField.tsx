/* eslint-disable jsx-a11y/no-onchange */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { FocusEventHandler } from 'react';
import { FormGroup, HelpBlock } from 'react-bootstrap';
import { FieldErrorMessage } from './FieldErrorMessage';

export type SelectFieldOnChangeEvent = (event: { field: string; value: string | null }) => void;

export interface SelectFieldOption {
  value: string;
  text: string;
}

export interface SelectFieldProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  error?: string;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  labelClassName?: string;
  onChange: SelectFieldOnChangeEvent;
  options: SelectFieldOption[];
  required?: boolean;
  value?: string | null;
}

export const SelectField = ({ children, className, disabled, error, field, gutterBottom, helperText, label, labelClassName, onChange, options, required, value }: SelectFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const fieldId = `form-field-${field}`;

  const handleOnChange: FocusEventHandler<HTMLSelectElement> = (event): void => {
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  const selectedValue = options.find((el) => el.value === value)?.value ?? '';

  return (
    <FormGroup controlId={fieldId} className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <label id={fieldId + '-label'} htmlFor={fieldId} className={`control-label ${labelClassName ?? ''} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName}`}>{t('common:field-required')}</strong>}
      </label>
      {children && <div className="tw-mb-4">{children}</div>}
      {helperText && <HelpBlock id={fieldId + '-help-text'}>{helperText}</HelpBlock>}
      {error && <FieldErrorMessage message={error} />}
      <select id={fieldId} aria-describedby={helperText ? fieldId + '-help-text' : undefined} value={selectedValue} onChange={handleOnChange} disabled={disabled} className={`form-control ${className ?? ''}`}>
        <option value="" disabled hidden>
          {t('common:please-select')}
        </option>
        {options.map((el) => (
          <option key={el.value} value={el.value}>
            {el.text}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};
