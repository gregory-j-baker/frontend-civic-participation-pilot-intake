import useTranslation from 'next-translate/useTranslation';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import { FormEvent } from 'react';

export interface ITextAreaFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface ITextAreaFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: ITextAreaFieldOnChangeEvent;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string | null;
}

const TextAreaField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, placeholder, required, rows, value }: ITextAreaFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-text-field-${field}`;

  const handleOnChange: React.FormEventHandler<FormControl> = (event): void => {
    const target = event.target as HTMLInputElement;
    const val = target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  return (
    <FormGroup controlId={fieldId} validationState={error ? 'error' : null} className={gutterBottom ? 'tw-mb-8' : 'tw-mb-0'} bsSize="small">
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
