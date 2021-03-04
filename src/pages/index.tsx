/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useMemo } from 'react';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { theme } from '../config';
import { Button } from '../components/Button';
import { CheckboxeField, CheckboxeFieldOnChangeEvent } from '../components/form/CheckboxeField';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../components/form/RadiosField';
import { SelectField, SelectFieldOnChangeEvent, SelectFieldOption } from '../components/form/SelectField';
import { TextField, TextFieldOnChangeEvent } from '../components/form/TextField';
import { TextAreaField, TextAreaFieldOnChangeEvent } from '../components/form/TextAreaField';
import { MainLayout } from '../components/layouts/main/MainLayout';
import useCurrentBreakpoint from '../hooks/useCurrentBreakpoint';
import { getYears } from '../utils/misc-utils';

interface FormDataState {
  [key: string]: boolean | string | string[] | null;
  aboutYourself: string | null;
  accessDedicatedDevice: string | null;
  canadienCitizenOrProctedPerson: string | null;
  consent: boolean;
  email: string | null;
  educationLevel: string | null;
  facilitateParticipation: string | null;
  firstName: string | null;
  gender: string | null;
  internetAccess: string | null;
  majorAge: boolean;
  partCSCPilot: string | null;
  positiveImpact: string | null;
  lastName: string | null;
  preferedContactLanguage: string | null;
  province: string | null;
  yearOfBirth: string | null;
}

const Home: NextPage = () => {
  const { t } = useTranslation();
  const currentBreakpoint = useCurrentBreakpoint();
  const { breakpoints } = theme;

  const [formData, setFormDataState] = useState<FormDataState>({
    aboutYourself: null,
    accessDedicatedDevice: null,
    canadienCitizenOrProctedPerson: null,
    consent: false,
    email: null,
    educationLevel: null,
    facilitateParticipation: null,
    firstName: null,
    gender: null,
    internetAccess: null,
    majorAge: false,
    partCSCPilot: null,
    positiveImpact: null,
    lastName: null,
    preferedContactLanguage: null,
    province: null,
    yearOfBirth: null,
  });

  const onFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent & SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: value }));
  };

  const onCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: checked }));
  };

  const yearOfBirthOptions = useMemo<SelectFieldOption[]>(() => {
    const years = getYears({}).map((year) => ({ value: year.toString(), text: `${year}` }));
    return [{ value: '', text: '' }, ...years];
  }, []);

  const preferedContactLanguageOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: 'en', text: t('common:language.en') },
      { value: 'fr', text: t('common:language.fr') },
    ],
    [t]
  );

  const canadienCitizenOrProctedPersonOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: 'yes', text: t('common:yes') },
      { value: 'no', text: t('common:no') },
    ],
    [t]
  );

  const provinceOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: '', text: '' },
      { value: 'AB', text: 'Alberta' },
      { value: 'BC', text: 'British Columbia' },
      { value: 'ON', text: 'Ontario' },
      { value: 'NB', text: 'New Brunswick' },
    ],
    []
  );

  const genderOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: 'male', text: 'Male' },
      { value: 'female', text: 'Female' },
      { value: 'another', text: 'Another gender not listed' },
      { value: 'noanswer', text: 'Prefer not to answer' },
    ],
    []
  );

  const educationLevelOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: '', text: '' },
      { value: 'nocert', text: 'No certificate, diploma or degree' },
      { value: 'highschool', text: 'Secondary (high) school diploma or equivalency certificate' },
      { value: 'noanswer', text: 'Prefer not to answer' },
    ],
    []
  );

  const internetAccessOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: '', text: '' },
      { value: 'yes', text: 'Yes' },
      { value: 'intermittent', text: 'Intermittent' },
      { value: 'outsidehome', text: 'Outside of my home' },
      { value: 'no', text: 'No' },
    ],
    []
  );

  const accessDedicatedDeviceOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: 'yes', text: t('common:yes') },
      { value: 'no', text: t('common:no') },
    ],
    [t]
  );

  return (
    <MainLayout>
      <h3 className="tw-mb-20">{t('home:application-form.header')}</h3>
      <h4 className="tw-border-b-2 tw-pb-5 tw-mb-16">{t('home:application-form.personal-information.header')}</h4>
      <TextField
        field={nameof<FormDataState>((o) => o.firstName)}
        label={t('home:application-form.personal-information.first-name')}
        value={formData.firstName}
        onChange={onFieldChange}
        required
        gutterBottom
        className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
      />
      <TextField field={nameof<FormDataState>((o) => o.lastName)} label={t('home:application-form.personal-information.last-name')} value={formData.lastName} onChange={onFieldChange} required gutterBottom className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12" />
      <TextField field={nameof<FormDataState>((o) => o.email)} label={t('home:application-form.personal-information.email-address')} value={formData.email} onChange={onFieldChange} required gutterBottom className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12" />
      <SelectField
        field={nameof<FormDataState>((o) => o.yearOfBirth)}
        label={t('home:application-form.personal-information.year-of-birth')}
        value={formData.yearOfBirth}
        onChange={onFieldChange}
        options={yearOfBirthOptions}
        required
        gutterBottom
        className="tw-w-40"
      />
      <CheckboxeField field={nameof<FormDataState>((o) => o.majorAge)} label={t('home:application-form.personal-information.major-age')} checked={formData.majorAge} onChange={onCheckboxFieldChange} required gutterBottom />
      <RadiosField
        field={nameof<FormDataState>((o) => o.preferedLanguage)}
        label={t('home:application-form.personal-information.prefered-contact-language')}
        value={formData.preferedContactLanguage}
        onChange={onFieldChange}
        options={preferedContactLanguageOptions}
        required
        gutterBottom
        inline
      />
      <RadiosField
        field={nameof<FormDataState>((o) => o.canadienCitizenOrProctedPerson)}
        label={t('home:application-form.personal-information.canadien-citizen-or-procted-person')}
        value={formData.canadienCitizenOrProctedPerson}
        onChange={onFieldChange}
        options={canadienCitizenOrProctedPersonOptions}
        required
        gutterBottom
        inline
      />
      <SelectField
        field={nameof<FormDataState>((o) => o.province)}
        label={t('home:application-form.personal-information.province')}
        value={formData.province}
        onChange={onFieldChange}
        options={provinceOptions}
        required
        gutterBottom
        className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
      />
      <RadiosField
        field={nameof<FormDataState>((o) => o.gender)}
        label={t('home:application-form.personal-information.gender')}
        value={formData.gender}
        onChange={onFieldChange}
        options={genderOptions}
        required
        gutterBottom
        inline={(currentBreakpoint ?? 0) >= breakpoints.md}
      />
      <SelectField
        field={nameof<FormDataState>((o) => o.educationLevel)}
        label={t('home:application-form.personal-information.education-level')}
        value={formData.educationLevel}
        onChange={onFieldChange}
        options={educationLevelOptions}
        required
        className="tw-w-full md:tw-w-8/12"
      />
      <h4 className="tw-border-b-2 tw-pb-5 tw-mt-20 tw-mb-16">{t('home:application-form.expression-of-interest-questions.header')}</h4>
      <TextAreaField
        field={nameof<FormDataState>((o) => o.partCSCPilot)}
        label={t('home:application-form.expression-of-interest-questions.part-csc-pilot')}
        value={formData.partCSCPilot}
        onChange={onFieldChange}
        required
        gutterBottom
        className="tw-w-full"
      />
      <TextAreaField
        field={nameof<FormDataState>((o) => o.aboutYourself)}
        label={t('home:application-form.expression-of-interest-questions.about-yourself')}
        value={formData.aboutYourself}
        onChange={onFieldChange}
        required
        gutterBottom
        className="tw-w-full"
      />
      <TextAreaField
        field={nameof<FormDataState>((o) => o.positiveImpact)}
        label={t('home:application-form.expression-of-interest-questions.positive-impact')}
        value={formData.positiveImpact}
        onChange={onFieldChange}
        required
        gutterBottom
        className="tw-w-full"
      />
      <TextAreaField
        field={nameof<FormDataState>((o) => o.facilitateParticipation)}
        label={t('home:application-form.expression-of-interest-questions.facilitate-participation')}
        value={formData.facilitateParticipation}
        onChange={onFieldChange}
        required
        gutterBottom
        className="tw-w-full"
      />
      <SelectField
        field={nameof<FormDataState>((o) => o.internetAccess)}
        label={t('home:application-form.expression-of-interest-questions.internet-access')}
        value={formData.internetAccess}
        onChange={onFieldChange}
        options={internetAccessOptions}
        required
        gutterBottom
        className="tw-w-full md:tw-w-8/12"
      />
      <RadiosField
        field={nameof<FormDataState>((o) => o.accessDedicatedDevice)}
        label={t('home:application-form.expression-of-interest-questions.access-dedicated-device')}
        value={formData.accessDedicatedDevice}
        onChange={onFieldChange}
        options={accessDedicatedDeviceOptions}
        required
        inline
      />
      <div className="tw-mt-32">
        <CheckboxeField field={nameof<FormDataState>((o) => o.consent)} label={t('home:application-form.consent')} checked={formData.consent} onChange={onCheckboxFieldChange} />
      </div>
      <div className="tw-my-20">
        <Button onClick={(event) => console.log(event)}>{t('home:application-form.submit')}</Button>
      </div>
    </MainLayout>
  );
};

export default Home;
