/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { ChangeEventHandler } from 'react';
import { FieldErrorMessage } from './FieldErrorMessage';
import { FieldHelpBlock } from './FieldHelpBlock';

export type TextFieldOnChangeEvent = (event: { field: string; value: string | null }) => void;

export interface TextFieldProps {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  error?: string;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  labelClassName?: string;
  maxLength?: number;
  onChange: TextFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
  type?: 'email' | 'search' | 'tel' | 'text';
  value?: string | null;
}

export const TextField = ({ children, className, disabled, error, field, gutterBottom, helperText, label, labelClassName, maxLength, onChange, placeholder, required, type, value }: TextFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-field-${field}`;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
    const target = event.target as HTMLInputElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  return (
    <div className={`form-group ${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}`}>
      <label id={fieldId + '-label'} htmlFor={fieldId} className={`control-label tw-w-full tw-mb-1 ${labelClassName ?? ''} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName}`}>{t('common:field-required')}</strong>}
        {children && <div className="tw-my-2">{children}</div>}
        {error && <FieldErrorMessage message={error} />}
      </label>
      {helperText && <FieldHelpBlock id={fieldId + '-help-text'}>{helperText}</FieldHelpBlock>}
      <input
        type={type ?? 'text'}
        id={fieldId}
        aria-describedby={helperText ? fieldId + '-help-text' : undefined}
        value={value ?? ''}
        onChange={handleOnChange}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`form-control ${className ?? ''}`}
      />
    </div>
  );
};
