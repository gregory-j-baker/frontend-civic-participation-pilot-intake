/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { useCallback, useMemo } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { WordRegExp } from '../../common/WordRegExp';
import { FieldErrorMessage } from './FieldErrorMessage';

export type TextAreaFieldOnChangeEvent = (event: { field: string; value: string | null }) => void;

export interface TextAreaFieldProps {
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
  onChange: TextAreaFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string | null;
  wordLimit?: number;
}

export const TextAreaField = ({ children, className, disabled, error, field, gutterBottom, helperText, label, labelClassName, maxLength, onChange, placeholder, required, rows, value, wordLimit }: TextAreaFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-field-${field}`;

  const getWordCount = useCallback((val?: string | null): number => {
    const reg = WordRegExp;
    return val?.match(reg)?.length ?? 0;
  }, []);

  const wordCount = useMemo(() => getWordCount(value), [getWordCount, value]);

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLInputElement;
    const val = target.value;

    if (!wordLimit || getWordCount(val) <= wordLimit) {
      onChange({ field, value: val.length > 0 ? val : null });
    }
  };

  const contentRows = (value ?? '').split('\n').length;

  return (
    <FormGroup controlId={fieldId} className={gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}>
      <ControlLabel className={`${labelClassName} ${required ? 'required' : ''}`}>
        <span className="field-name tw-mr-2">{label}</span>
        {required && <strong className={`required ${labelClassName}`}>{t('common:field-required')}</strong>}
      </ControlLabel>
      {children && <div className="tw-mb-4">{children}</div>}
      {helperText && <HelpBlock>{helperText}</HelpBlock>}
      {error && <FieldErrorMessage message={error} />}
      <FormControl componentClass="textarea" id={fieldId} value={value ?? ''} disabled={disabled} onChange={handleOnChange} placeholder={placeholder} maxLength={maxLength} className={className} rows={Math.max(contentRows, rows ?? 5)} />
      {
        <div className="tw-italic tw-text-sm tw-px-4 tw-py-1 tw-border-l-4 tw--mt-2 tw-pt-3 tw-rounded tw-bg-gray-50 tw-border-gray-600 tw-shadow">
          {t(wordLimit ? 'common:textarea.word-count-limit' : 'common:textarea.word-count', { count: wordCount, limit: wordLimit ?? -1 })}
        </div>
      }
    </FormGroup>
  );
};
