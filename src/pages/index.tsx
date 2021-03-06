/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useMemo, useState } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Button } from '../components/Button';
import type { CheckboxeFieldOnChangeEvent } from '../components/form/CheckboxeField';
import { CheckboxeField } from '../components/form/CheckboxeField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../components/form/SelectField';
import { SelectField } from '../components/form/SelectField';
import type { TextAreaFieldOnChangeEvent } from '../components/form/TextAreaField';
import { TextAreaField } from '../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../components/form/TextField';
import { TextField } from '../components/form/TextField';
import { MainLayout } from '../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../components/PageLoadingSpinner';
import useEducationLevels, { educationLevelStaticProps } from '../hooks/api/useEducationLevels';
import useGenders, { genderStaticProps } from '../hooks/api/useGenders';
import useIndigenousTypes, { indigenousTypeStaticProps } from '../hooks/api/useIndigenousTypes';
import useInternetQualities, { internetQualitiesStaticProps } from '../hooks/api/useInternetQualities';
import useLanguages, { languagesStaticProps } from '../hooks/api/useLanguages';
import useProvinces, { provincesStaticProps } from '../hooks/api/useProvinces';
import { getYears } from '../utils/misc-utils';
import Error from './_error';

interface FormDataState {
  [key: string]: boolean | string | string[] | null;
  aboutYourself: string | null;
  accessDedicatedDevice: string | null;
  canadienCitizen: string | null;
  consent: boolean;
  email: string | null;
  educationLevel: string | null;
  facilitateParticipation: string | null;
  firstName: string | null;
  gender: string | null;
  hearAboutCPP: string | null;
  identityDisability: string | null;
  identityIndigenous: string | null;
  identityLGBTQ2: string | null;
  identityNewcomer: string | null;
  identityRuralRemoteArea: string | null;
  identityVisibleMinority: string | null;
  internetQuality: string | null;
  isProvinceMajor: boolean;
  positiveImpact: string | null;
  lastName: string | null;
  preferedLanguage: string | null;
  province: string | null;
  yearOfBirth: string | null;
}

const Home: NextPage = () => {
  const { lang, t } = useTranslation();

  const { data: educationLevels, isLoading: isEducationLevelsLoading, error: educationLevelsError } = useEducationLevels();
  const { data: genders, isLoading: isGendersLoading, error: gendersError } = useGenders();
  const { data: indigenousTypes, isLoading: isIndigenousTypesLoading, error: indigenousTypesError } = useIndigenousTypes();
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities();
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces();

  const [formData, setFormDataState] = useState<FormDataState>({
    aboutYourself: null,
    accessDedicatedDevice: null,
    canadienCitizen: null,
    consent: false,
    email: null,
    educationLevel: null,
    facilitateParticipation: null,
    firstName: null,
    gender: null,
    hearAboutCPP: null,
    identityDisability: null,
    identityIndigenous: null,
    identityLGBTQ2: null,
    identityNewcomer: null,
    identityRuralRemoteArea: null,
    identityVisibleMinority: null,
    internetQuality: null,
    isProvinceMajor: false,
    positiveImpact: null,
    lastName: null,
    preferedLanguage: null,
    province: null,
    yearOfBirth: null,
  });

  const onFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent & SelectFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: value }));
  };

  const onCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: checked }));
  };

  // year of birth select options
  const yearOfBirthOptions = useMemo<SelectFieldOption[]>(() => getYears({}).map((year) => ({ value: year.toString(), text: `${year}` })), []);

  // prefered language select options
  const preferedLanguageOptions = useMemo<SelectFieldOption[]>(() => {
    if (isLanguagesLoading || languagesError) return [];
    return languages?._embedded.languages.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? [];
  }, [lang, isLanguagesLoading, languagesError, languages]);

  // province select options
  const provinceOptions = useMemo<SelectFieldOption[]>(() => {
    if (isProvincesLoading || provincesError) return [];
    return provinces?._embedded.provinces.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? [];
  }, [lang, isProvincesLoading, provincesError, provinces]);

  // gender select options
  const genderOptions = useMemo<SelectFieldOption[]>(() => {
    if (isGendersLoading || gendersError) return [];
    return genders?._embedded.genders.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? [];
  }, [lang, isGendersLoading, gendersError, genders]);

  // education level select options
  const educationLevelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isEducationLevelsLoading || educationLevelsError) return [];
    return educationLevels?._embedded.educationLevels.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? [];
  }, [lang, isEducationLevelsLoading, educationLevelsError, educationLevels]);

  // indigenous types select options
  const indigenousTypeOptions = useMemo<SelectFieldOption[]>(() => {
    if (isIndigenousTypesLoading || indigenousTypesError) return [];
    return [...(indigenousTypes?._embedded.indigenousTypes.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? []), { value: 'NONE', text: t('common:no') }];
  }, [t, lang, isIndigenousTypesLoading, indigenousTypesError, indigenousTypes]);

  // internet quality select options
  const internetQualityOptions = useMemo<SelectFieldOption[]>(() => {
    if (isInternetQualitiesLoading || internetQualitiesError) return [];
    return [...(internetQualities?._embedded.internetQualities.map(({ id, descriptionFr, descriptionEn }) => ({ value: id, text: lang === 'fr' ? descriptionFr : descriptionEn })) ?? []), { value: 'NONE', text: t('common:no') }];
  }, [t, lang, isInternetQualitiesLoading, internetQualitiesError, internetQualities]);

  // access dedicated device select options
  const hearAboutCPPOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: 'word-of-mouth', text: 'Word of mouth' },
      { value: 'search-engine', text: 'Search engine' },
      { value: 'other', text: 'Other' },
    ],
    []
  );

  const yesNoOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: 'yes', text: t('common:yes') },
      { value: 'no', text: t('common:no') },
    ],
    [t]
  );

  const yesNoNoPreferNotAnswerOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: 'yes', text: t('common:yes') },
      { value: 'no', text: t('common:no') },
      { value: 'prefer-not-answer', text: t('common:prefer-not-answer') },
    ],
    [t]
  );

  if (educationLevelsError || gendersError || indigenousTypesError || internetQualitiesError || internetQualitiesError || languagesError || provincesError) {
    return <Error err={(educationLevelsError ?? gendersError ?? indigenousTypesError ?? internetQualitiesError ?? internetQualitiesError ?? languagesError ?? provincesError) as Error} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      <NextSeo title={t('home:page.header')} />
      <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
        {t('common:app.title')}
      </h1>
      <h2 className="tw-border-b-2 tw-pb-4 tw-m-0 tw-mb-12 tw-text-2xl">{t('home:page.header')}</h2>
      {isEducationLevelsLoading || isGendersLoading || isIndigenousTypesLoading || isInternetQualitiesLoading || isLanguagesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <h3 className="tw-m-0 tw-mb-14 tw-text-2xl">{t('home:application-form.header')}</h3>
          <h4 className="tw-border-b-2 tw-pb-4 tw-m-0 tw-mb-12 tw-text-xl">{t('home:application-form.personal-information.header')}</h4>
          <TextField
            field={nameof<FormDataState>((o) => o.firstName)}
            label={t('home:application-form.personal-information.first-name')}
            value={formData.firstName}
            onChange={onFieldChange}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
          />
          <TextField
            field={nameof<FormDataState>((o) => o.lastName)}
            label={t('home:application-form.personal-information.last-name')}
            value={formData.lastName}
            onChange={onFieldChange}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
          />
          <TextField
            field={nameof<FormDataState>((o) => o.email)}
            label={t('home:application-form.personal-information.email-address')}
            value={formData.email}
            onChange={onFieldChange}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
          />

          <SelectField field={nameof<FormDataState>((o) => o.yearOfBirth)} label={t('home:application-form.personal-information.year-of-birth')} value={formData.yearOfBirth} onChange={onFieldChange} options={yearOfBirthOptions} required gutterBottom />

          <CheckboxeField field={nameof<FormDataState>((o) => o.isProvinceMajor)} label={t('home:application-form.personal-information.is-province-major')} checked={formData.isProvinceMajor} onChange={onCheckboxFieldChange} required />
          <div className="tw-mb-8 tw-pl-10">
            <a href="http://example.com" target="_blank" rel="noreferrer">
              {t('home:application-form.personal-information.is-province-major-link')}
            </a>
          </div>

          <SelectField
            field={nameof<FormDataState>((o) => o.preferedLanguage)}
            label={t('home:application-form.personal-information.prefered-language')}
            value={formData.preferedLanguage}
            onChange={onFieldChange}
            options={preferedLanguageOptions}
            required
            gutterBottom
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.canadienCitizen)}
            label={t('home:application-form.personal-information.canadien-citizen')}
            value={formData.canadienCitizen}
            onChange={onFieldChange}
            options={yesNoOptions}
            required
            gutterBottom
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.province)}
            label={t('home:application-form.personal-information.province')}
            value={formData.province}
            onChange={onFieldChange}
            options={provinceOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.gender)}
            label={t('home:application-form.personal-information.gender')}
            value={formData.gender}
            onChange={onFieldChange}
            options={genderOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <h5 className="tw-m-0 tw-mb-4">{t('home:application-form.personal-information.identity.header')}</h5>

          <div className="tw-p-6 tw-rounded-md tw-shadow-md tw-mb-8 tw-border tw-border-gray-300">
            <SelectField
              field={nameof<FormDataState>((o) => o.identityDisability)}
              label={t('home:application-form.personal-information.identity.disability')}
              value={formData.identityDisability}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.identityVisibleMinority)}
              label={t('home:application-form.personal-information.identity.visible-minority')}
              value={formData.identityVisibleMinority}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.identityIndigenous)}
              label={t('home:application-form.personal-information.identity.indigenous')}
              value={formData.identityIndigenous}
              onChange={onFieldChange}
              options={indigenousTypeOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.identityLGBTQ2)}
              label={t('home:application-form.personal-information.identity.lgbtq2')}
              value={formData.identityLGBTQ2}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.identityRuralRemoteArea)}
              label={t('home:application-form.personal-information.identity.rural-remote-area')}
              value={formData.identityRuralRemoteArea}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.identityNewcomer)}
              label={t('home:application-form.personal-information.identity.newcomer')}
              value={formData.identityNewcomer}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              className="tw-w-6/12 md:tw-w-4/12"
            />
          </div>

          <SelectField
            field={nameof<FormDataState>((o) => o.educationLevel)}
            label={t('home:application-form.personal-information.education-level')}
            value={formData.educationLevel}
            onChange={onFieldChange}
            options={educationLevelOptions}
            required
            className="tw-w-full md:tw-w-8/12"
          />

          <h4 className="tw-border-b-2 tw-pb-5 tw-mt-20 tw-mb-16 tw-text-xl">{t('home:application-form.expression-of-interest-questions.header')}</h4>

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
            gutterBottom
            className="tw-w-full"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.internetQuality)}
            label={t('home:application-form.expression-of-interest-questions.internet-quality')}
            value={formData.internetQuality}
            onChange={onFieldChange}
            options={internetQualityOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.accessDedicatedDevice)}
            label={t('home:application-form.expression-of-interest-questions.access-dedicated-device')}
            value={formData.accessDedicatedDevice}
            onChange={onFieldChange}
            options={yesNoOptions}
            required
            gutterBottom
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.hearAboutCPP)}
            label={t('home:application-form.expression-of-interest-questions.hear-about-cpp')}
            value={formData.hearAboutCPP}
            onChange={onFieldChange}
            options={hearAboutCPPOptions}
            required
            className="tw-w-full sm:tw-w-6/12"
          />

          <div className="tw-mt-20">
            <CheckboxeField field={nameof<FormDataState>((o) => o.consent)} label={t('home:application-form.consent')} checked={formData.consent} onChange={onCheckboxFieldChange} />
          </div>

          <div className="tw-mt-16">
            <Button onClick={(event) => console.log(event)}>{t('home:application-form.submit')}</Button>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('education-levels', () => educationLevelStaticProps);
  await queryClient.prefetchQuery('genders', () => genderStaticProps);
  await queryClient.prefetchQuery('indigenous-types', () => indigenousTypeStaticProps);
  await queryClient.prefetchQuery('internet-qualities', () => internetQualitiesStaticProps);
  await queryClient.prefetchQuery('languages', () => languagesStaticProps);
  await queryClient.prefetchQuery('provinces', () => provincesStaticProps);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
