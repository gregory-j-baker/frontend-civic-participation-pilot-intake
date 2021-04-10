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

export type RadiosFieldOnChangeEvent = (event: { field: string; value: string | null }) => void;

export interface RadiosFieldOption {
  disabled?: boolean;
  value: string;
  text: string;
}

export interface RadiosFieldProps {
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
  onChange: RadiosFieldOnChangeEvent;
  options: RadiosFieldOption[];
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

export const RadiosField = ({ children, className, disabled, error, field, gutterBottom, helperText, inline, label, labelClassName, onChange, options, required, value }: RadiosFieldProps): JSX.Element => {
  const { t } = useTranslation();
  const fieldId = `form-field-${field}`;
  const groupName = `form-field-group-${field}`;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    onChange({ field, value: target.value });
  };

  const selectedValue = options.find((option) => option.value === value)?.value ?? '';

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
            <InputRadio key={el.value} {...{ className: 'radio-inline', disabled, fieldId, groupName, helperText, index, onChange: handleOnChange, option: el, selectedValue }} />
          ))}
        </div>
      ) : (
        options.map((el, index) => (
          <div key={el.value} className="radio">
            <InputRadio {...{ className, disabled, fieldId, groupName, helperText, index, onChange: handleOnChange, option: el, selectedValue }} />
          </div>
        ))
      )}
    </fieldset>
  );
};

export interface InputRadioProps {
  className?: string;
  disabled?: boolean;
  fieldId: string;
  groupName: string;
  helperText?: string;
  index: number;
  inline?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  option: RadiosFieldOption;
  selectedValue: string;
}

export const InputRadio = ({ className, disabled, fieldId, groupName, helperText, index, onChange, option, selectedValue }: InputRadioProps): JSX.Element => {
  const id = index === 0 ? fieldId : `${fieldId}-${index + 1}`;

  return (
    <label key={option.value} htmlFor={id} className={className}>
      <input
        type="radio"
        id={id}
        aria-describedby={index === 0 && helperText ? fieldId + '-help-text' : undefined}
        name={groupName}
        value={option.value}
        onChange={onChange}
        checked={option.value === selectedValue}
        disabled={option.disabled || disabled}
        title=""
      />
      {' ' + option.text}
    </label>
  );
};
