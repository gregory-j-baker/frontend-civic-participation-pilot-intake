/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Checkbox, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';

export interface CheckboxeFieldOnChangeEvent {
  (event: { field: string; checked: boolean }): void;
}

export interface CheckboxeFieldProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: CheckboxeFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const CheckboxeField = ({ className, checked, disabled, error, field, gutterBottom, helperText, label, onChange, required }: CheckboxeFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-checkboxe-field-${field}`;

  const handleOnChange: React.FormEventHandler<Checkbox> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, checked: target.checked });
  };

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-12' : 'tw-mb-0'} bsSize="small">
      <Checkbox id={fieldId} onChange={handleOnChange} checked={checked} disabled={disabled} className={className} style={{ fontSize: 'inherit' }}>
        <ControlLabel className={`${required ? 'required' : null}`}>
          <span className="field-name tw-font-bold" style={{ fontSize: '1em;' }}>
            {label}
          </span>
          {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
        </ControlLabel>
      </Checkbox>
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default CheckboxeField;
