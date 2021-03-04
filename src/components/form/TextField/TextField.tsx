/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export interface TextFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface TextFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: TextFieldOnChangeEvent;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

const TextField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, maxLength, placeholder, required, value }: TextFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-text-field-${field}`;

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLTextAreaElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-12' : 'tw-mb-0'}>
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
      </ControlLabel>
      <FormControl type="text" id={fieldId} value={value ?? ''} onChange={handleOnChange} disabled={disabled} maxLength={maxLength} placeholder={placeholder} className={className} />
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default TextField;
