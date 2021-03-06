/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

export interface SelectFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface SelectFieldOption {
  value: string;
  text: string;
}

export interface SelectFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: SelectFieldOnChangeEvent;
  options: SelectFieldOption[];
  required?: boolean;
  rows?: number;
  value?: string | null;
}

const SelectField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, options, required, value }: SelectFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const fieldId = `form-select-field-${field}`;

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLSelectElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  const selectedValue = options?.find((option) => option.value === value)?.value ?? undefined;

  console.log(selectedValue);

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${required ? 'required' : null}`}>
        <span className="field-name">{label}</span>
        {required && <strong className="required tw-ml-2">{t('common:field-required')}</strong>}
      </ControlLabel>
      <FormControl componentClass="select" id={fieldId} onChange={handleOnChange} disabled={disabled} className={className}>
        {selectedValue === undefined && (
          <option value="" disabled hidden selected={selectedValue === undefined}>
            {t('common:please-select')}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} selected={option.value === selectedValue}>
            {option.text}
          </option>
        ))}
      </FormControl>
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
    </FormGroup>
  );
};

export default SelectField;
