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

export type CheckboxesFieldOnChangeEvent = (event: { field: string; value: string | null; checked: boolean }) => void;

export interface CheckboxesFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface CheckboxesFieldProps {
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
  onChange: CheckboxesFieldOnChangeEvent;
  options: CheckboxesFieldOption[];
  placeholder?: string;
  required?: boolean;
  values?: string[] | null;
}

export const CheckboxesField = ({ children, className, disabled, error, field, gutterBottom, helperText, inline, label, labelClassName, onChange, options, required, values }: CheckboxesFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-field-${field}`;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value, checked: target.checked });
  };

  const checkedValues = options?.map((el) => el.value).filter((value) => (values ?? []).includes(value)) ?? [];

  return (
    <fieldset className={`form-group tw-p-0 tw-border-none ${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}`}>
      <legend className={`tw-text-base tw-font-bold tw-w-full tw-mb-1 tw-float-none ${labelClassName ?? ''} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName ?? ''}`}>{t('common:field-required')}</strong>}
        {children && <div className="tw-my-2">{children}</div>}
        {error && <FieldErrorMessage message={error} />}
      </legend>
      {helperText && <FieldHelpBlock id={fieldId + '-help-text'}>{helperText}</FieldHelpBlock>}
      {inline ? (
        <div className="form-group">
          {options.map((el, index) => (
            <InputCheckboxe key={el.value} {...{ checkedValues, className: 'checkbox-inline', disabled, fieldId, helperText, index, onChange: handleOnChange, option: el }} />
          ))}
        </div>
      ) : (
        options.map((el, index) => (
          <div key={el.value} className="checkbox">
            <InputCheckboxe {...{ checkedValues, className, disabled, fieldId, helperText, index, onChange: handleOnChange, option: el }} />
          </div>
        ))
      )}
    </fieldset>
  );
};

export interface InputCheckboxeProps {
  checkedValues: string[];
  className?: string;
  disabled?: boolean;
  fieldId: string;
  helperText?: string;
  index: number;
  inline?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  option: CheckboxesFieldOption;
}

export const InputCheckboxe = ({ checkedValues, className, disabled, fieldId, helperText, index, onChange, option }: InputCheckboxeProps): JSX.Element => {
  const id = index === 0 ? fieldId : `${fieldId}-${index + 1}`;

  return (
    <label key={option.value} htmlFor={id} className={className}>
      <input
        type="checkboxe"
        id={id}
        aria-describedby={index === 0 && helperText ? fieldId + '-help-text' : undefined}
        value={option.value}
        onChange={onChange}
        checked={checkedValues.includes(option.value)}
        disabled={option.disabled || disabled}
        title=""
      />
      {' ' + option.text}
    </label>
  );
};
