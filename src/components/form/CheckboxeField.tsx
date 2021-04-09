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

export type CheckboxeFieldOnChangeEvent = (event: { field: string; checked: boolean }) => void;

export interface CheckboxeFieldProps {
  children?: React.ReactNode;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  error?: string;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  labelClassName?: string;
  onChange: CheckboxeFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
}

export const CheckboxeField = ({ children, className, checked, disabled, error, field, gutterBottom, helperText, label, labelClassName, onChange, required }: CheckboxeFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-field-${field}`;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, checked: target.checked });
  };

  return (
    <div className={`form-group ${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'} ${className ?? ''}`}>
      <div className="checkbox tw-pl-5 tw-text-base">
        <input type="checkbox" id={fieldId} aria-describedby={helperText ? fieldId + '-help-text' : undefined} onChange={handleOnChange} checked={checked ?? false} disabled={disabled} />
        <label htmlFor={fieldId} className={`control-label tw-w-full tw-mb-1 ${labelClassName ?? ''} ${required ? 'required' : ''}`} style={{ fontWeight: 'bold' }}>
          <span className={`field-name tw-mr-2`}>{label}</span>
          {required && <strong className="required">{t('common:field-required')}</strong>}
          {children && <div className="tw-my-2">{children}</div>}
          {error && <FieldErrorMessage message={error} />}
        </label>
      </div>
      {helperText && <FieldHelpBlock id={fieldId + '-help-text'}>{helperText}</FieldHelpBlock>}
    </div>
  );
};
