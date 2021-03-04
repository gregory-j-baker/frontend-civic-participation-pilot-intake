/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

export interface ISelectFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface ISelectFieldOption {
  value: string;
  text: string;
}

export interface ISelectFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: ISelectFieldOnChangeEvent;
  options: ISelectFieldOption[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string | null;
}

const SelectField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, options, placeholder, required, value }: ISelectFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const fieldId = `form-select-field-${field}`;

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  const selectedValue = options?.find((option) => option.value === value)?.value ?? '';

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
      </ControlLabel>
      <FormControl componentClass="select" id={fieldId} value={selectedValue} onChange={handleOnChange} disabled={disabled} placeholder={placeholder} className={className}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </FormControl>
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default SelectField;
