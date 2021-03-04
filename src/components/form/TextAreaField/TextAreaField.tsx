/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export interface TextAreaFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface TextAreaFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: TextAreaFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string | null;
}

const TextAreaField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, placeholder, required, rows, value }: TextAreaFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-text-area-field-${field}`;

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLInputElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-12' : 'tw-mb-0'} bsSize="small">
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
      </ControlLabel>
      <FormControl componentClass="textarea" id={fieldId} value={value ?? ''} disabled={disabled} onChange={handleOnChange} placeholder={placeholder} className={className} rows={rows ?? 5} />
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default TextAreaField;
