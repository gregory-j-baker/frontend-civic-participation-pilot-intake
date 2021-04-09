/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ChangeEventHandler } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { FormGroup, HelpBlock } from 'react-bootstrap';
import { FieldErrorMessage } from './FieldErrorMessage';

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
    <FormGroup controlId={fieldId} className={`${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'} ${className ?? ''}`}>
      <div className="checkbox tw-pl-5 tw-text-base">
        <input type="checkbox" id={fieldId} aria-describedby={helperText ? fieldId + '-help-text' : undefined} onChange={handleOnChange} checked={checked ?? false} disabled={disabled} />
        <label id={fieldId + '-label'} htmlFor={fieldId} className={`control-label ${labelClassName ?? ''} ${required ? 'required' : ''}`} style={{ fontWeight: 'bold' }}>
          <span className={`field-name tw-mr-2`}>{label}</span>
          {required && <strong className="required">{t('common:field-required')}</strong>}
        </label>
      </div>
      {children && <div className="tw-mb-4">{children}</div>}
      {helperText && <HelpBlock id={fieldId + '-help-text'}>{helperText}</HelpBlock>}
      {error && <FieldErrorMessage message={error} />}
    </FormGroup>
  );
};
