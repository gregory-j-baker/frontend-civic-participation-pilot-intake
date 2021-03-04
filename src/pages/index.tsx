/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useMemo } from 'react';
import { NextPage } from 'next';
import MainLayout from '../components/layouts/main/MainLayout';
import TextField from '../components/form/TextField';
import { ITextFieldOnChangeEvent } from '../components/form/TextField/TextField';
import TextAreaField from '../components/form/TextAreaField';
import SelectField from '../components/form/SelectField';
import { ISelectFieldOnChangeEvent, ISelectFieldOption } from '../components/form/SelectField/SelectField';
import RadiosField from '../components/form/RadiosField';
import { IRadiosFieldOnChangeEvent, IRadiosFieldOption } from '../components/form/RadiosField/RadiosField';
import CheckboxesField from '../components/form/CheckboxesField';
import { ICheckboxesFieldOnChangeEvent, ICheckboxesFieldOption } from '../components/form/CheckboxesField/CheckboxesField';
import { ITextAreaFieldOnChangeEvent } from '../components/form/TextAreaField/TextAreaField';

interface IFormData {
  [key: string]: string | string[] | null;
  textFieldData: string | null;
  textAreaFieldData: string | null;
  selectFieldData: string | null;
  radiosFieldData: string | null;
  checkboxesFieldData: string[] | null;
}

const Home: NextPage = () => {
  const [formData, setFormData] = useState<IFormData>({ textFieldData: null, textAreaFieldData: null, selectFieldData: null, radiosFieldData: null, checkboxesFieldData: null });

  const onFieldChange: ITextFieldOnChangeEvent & ITextAreaFieldOnChangeEvent & ISelectFieldOnChangeEvent & IRadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormData((prev) => ({ ...prev, [field as keyof IFormData]: value }));
  };

  const onCheckboxesFieldChange: ICheckboxesFieldOnChangeEvent = ({ field, value, checked }) => {
    setFormData((prevData) => {
      let prevField = (prevData[field] as string[] | null) ?? [];

      if (checked && value) prevField.push(value);
      else prevField = prevField.filter((val) => val !== value);

      return { ...prevData, [field as keyof IFormData]: prevField.length > 0 ? prevField : null };
    });
  };

  const selectFieldOptions = useMemo(
    () => ['1', '2', '3'].map<ISelectFieldOption>((value) => ({ value, text: `Select Option ${value}` })),
    []
  );
  const radiosFieldOptions = useMemo(
    () => ['1', '2', '3'].map<IRadiosFieldOption>((value) => ({ value, text: `Radio Option ${value}` })),
    []
  );
  const checkboxesFieldOptions = useMemo(
    () => ['1', '2', '3'].map<ICheckboxesFieldOption>((value) => ({ value, text: `Checkbox Option ${value}` })),
    []
  );

  return (
    <MainLayout>
      <TextField field={nameof<IFormData>((o) => o.textFieldData)} label="TextField" value={formData.textFieldData} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/2" />
      <TextAreaField field={nameof<IFormData>((o) => o.textAreaFieldData)} label="TextAreaField" value={formData.textAreaFieldData} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/2" />
      <SelectField field={nameof<IFormData>((o) => o.selectFieldData)} label="SelectField" value={formData.selectFieldData} options={selectFieldOptions} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/2" />
      <RadiosField field={nameof<IFormData>((o) => o.radiosFieldData)} label="RadiosField" value={formData.radiosFieldData} options={radiosFieldOptions} onChange={onFieldChange} required gutterBottom />
      <CheckboxesField field={nameof<IFormData>((o) => o.checkboxesFieldData)} label="CheckboxesField" values={formData.checkboxesFieldData} options={checkboxesFieldOptions} onChange={onCheckboxesFieldChange} required gutterBottom />
    </MainLayout>
  );
};

export default Home;
