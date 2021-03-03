import useTranslation from 'next-translate/useTranslation';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

export interface ITextFieldOnChangeEvent {
  (event: { field: string; value: string | null }): void;
}

export interface ITextFieldProps {
  className?: string;
  disabled?: boolean;
  error?: boolean;
  field: string;
  gutterBottom?: boolean;
  helperText?: string;
  label: string;
  onChange: ITextFieldOnChangeEvent;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  value?: string | null;
}

const TextField = ({ className, disabled, error, field, gutterBottom, helperText, label, onChange, maxLength, multiline, placeholder, required, value }: ITextFieldProps): JSX.Element => {
  const { t } = useTranslation();

  const fieldId = `form-text-field-${field}`;

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const val = event.target.value;
    onChange({ field, value: val.length > 0 ? val : null });
  };

  return (
    <div className={gutterBottom ? 'tw-mb-3' : 'tw-mb-0}'}>
      <FormGroup controlId={fieldId} validationState={error ? 'error' : null}>
        <ControlLabel className={`${required ? 'required' : null}`}>
          <span className="field-name">{label}</span>
          {required && <strong className="required tw-ml-1">{t('common:field-required')}</strong>}
        </ControlLabel>
        <FormControl type="text" id={fieldId} value={value ?? ''} disabled={disabled} onChange={handleOnChange} maxLength={maxLength} multiline={multiline} placeholder={placeholder} className={className} />
        {helperText && <HelpBlock>{helperText}</HelpBlock>}
      </FormGroup>
    </div>
  );
};

export default TextField;
