/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
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
import { getYears } from '../utils/misc-utils';

interface IFormData {
  [key: string]: string | string[] | null;
  canadienCitizenOrProctedPerson: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  yearOfBirth: string | null;
}

const Home: NextPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<IFormData>({ canadienCitizenOrProctedPerson: null, email: null, firstName: null, lastName: null, yearOfBirth: null });

  const onFieldChange: ITextFieldOnChangeEvent & ITextAreaFieldOnChangeEvent & ISelectFieldOnChangeEvent & IRadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormData((prev) => ({ ...prev, [field as keyof IFormData]: value }));
  };

  /*const onCheckboxesFieldChange: ICheckboxesFieldOnChangeEvent = ({ field, value, checked }) => {
    setFormData((prevData) => {
      let prevField = (prevData[field] as string[] | null) ?? [];

      if (checked && value) prevField.push(value);
      else prevField = prevField.filter((val) => val !== value);

      return { ...prevData, [field as keyof IFormData]: prevField.length > 0 ? prevField : null };
    });
  };*/

  const yearOfBirthOptions = useMemo<ISelectFieldOption[]>(() => {
    const years = getYears({}).map((year) => ({ value: year.toString(), text: `${year}` }));
    return [{ value: '', text: '' }, ...years];
  }, []);

  const canadienCitizenOrProctedPersonOptions = useMemo<IRadiosFieldOption[]>(() => {
    return [
      { value: 'yes', text: t('common:yes') },
      { value: 'no', text: t('common:no') },
    ];
  }, [t]);

  return (
    <MainLayout>
      <h3>{t('home:application-form.header')}</h3>
      <h4 className="tw-border-b-2 tw-pb-5 tw-mb-10">{t('home:application-form.personal-information.header')}</h4>
      <TextField field={nameof<IFormData>((o) => o.firstName)} label={t('home:application-form.personal-information.first-name')} value={formData.firstName} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/3" />
      <TextField field={nameof<IFormData>((o) => o.lastName)} label={t('home:application-form.personal-information.last-name')} value={formData.lastName} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/3" />
      <TextField field={nameof<IFormData>((o) => o.email)} label={t('home:application-form.personal-information.email-address')} value={formData.email} onChange={onFieldChange} required gutterBottom className="tw-w-full md:tw-w-1/2" />
      <SelectField
        field={nameof<IFormData>((o) => o.yearOfBirth)}
        label={t('home:application-form.personal-information.year-of-birth')}
        value={formData.yearOfBirth}
        onChange={onFieldChange}
        options={yearOfBirthOptions}
        required
        gutterBottom
        className="tw-w-40"
      />
      <RadiosField
        field={nameof<IFormData>((o) => o.canadienCitizenOrProctedPerson)}
        label={t('home:application-form.personal-information.canadien-citizen-or-procted-person')}
        value={formData.canadienCitizenOrProctedPerson}
        onChange={onFieldChange}
        options={canadienCitizenOrProctedPersonOptions}
        required
        gutterBottom
        inline
      />
    </MainLayout>
  );
};

export default Home;
