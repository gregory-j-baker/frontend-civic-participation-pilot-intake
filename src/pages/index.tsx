/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useMemo, useState, useEffect } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Button } from '../components/Button';
import ContentPaper from '../components/ContentPaper/ContentPaper';
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
  [key: string]: boolean | string | number | null | undefined;
  birthYear?: number;
  communityInterest?: string;
  educationLevelId?: string;
  email?: string;
  firstName?: string;
  genderId?: string;
  hasDedicatedDevice?: boolean;
  hearAboutCPP?: string;
  indigenousTypeId?: string;
  internetQualityId?: string;
  isCanadianCitizen?: boolean;
  isDisabled?: boolean | null;
  isInformationConsented: boolean;
  isLgbtq?: boolean | null;
  isMinority?: boolean | null;
  isNewcomer?: boolean | null;
  isProvinceMajorCertified: boolean;
  isRural?: boolean | null;
  languageId?: string;
  lastName?: string;
  miscInterest?: string;
  programInterest?: string;
  provinceId?: string;
  skillsInterest?: string;
}

const PERSISTING_STORAGE_FORM_DATA_KEY = 'CPP_APPLICATION_FORM_DATA_STATE';

const Home: NextPage = () => {
  const { lang, t } = useTranslation();

  const { data: educationLevels, isLoading: isEducationLevelsLoading, error: educationLevelsError } = useEducationLevels();
  const { data: genders, isLoading: isGendersLoading, error: gendersError } = useGenders();
  const { data: indigenousTypes, isLoading: isIndigenousTypesLoading, error: indigenousTypesError } = useIndigenousTypes();
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities();
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces();

  const [formData, setFormDataState] = useState<FormDataState>(() => {
    const defaultState: FormDataState = { isInformationConsented: false, isProvinceMajorCertified: false };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(PERSISTING_STORAGE_FORM_DATA_KEY);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  useEffect(() => {
    window.sessionStorage.setItem(PERSISTING_STORAGE_FORM_DATA_KEY, JSON.stringify(formData));
  }, [formData]);

  const onFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent & SelectFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      // yes/no
      if ([nameof<FormDataState>((o) => o.isCanadianCitizen), nameof<FormDataState>((o) => o.hasDedicatedDevice)].includes(field)) {
        return { ...prev, [field as keyof FormDataState]: value?.toLowerCase() === 'true' ?? undefined };
      }

      // yes/no/none
      if ([nameof<FormDataState>((o) => o.isDisabled), nameof<FormDataState>((o) => o.isMinority), nameof<FormDataState>((o) => o.isLgbtq), nameof<FormDataState>((o) => o.isRural), nameof<FormDataState>((o) => o.isNewcomer)].includes(field)) {
        if (value) {
          if (value === 'true') {
            return { ...prev, [field as keyof FormDataState]: true };
          }

          if (value === 'false') {
            return { ...prev, [field as keyof FormDataState]: false };
          }

          return { ...prev, [field as keyof FormDataState]: null };
        }

        return { ...prev, [field as keyof FormDataState]: undefined };
      }

      // number
      if ([nameof<FormDataState>((o) => o.birthYear)].includes(field)) {
        return { ...prev, [field as keyof FormDataState]: value ? Number(value) : undefined };
      }

      // string
      return { ...prev, [field as keyof FormDataState]: value ?? undefined };
    });
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
      { value: true.toString(), text: t('common:yes') },
      { value: false.toString(), text: t('common:no') },
    ],
    [t]
  );

  const yesNoNoPreferNotAnswerOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: true.toString(), text: t('common:yes') },
      { value: false.toString(), text: t('common:no') },
      { value: 'none', text: t('common:prefer-not-answer') },
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

          <SelectField
            field={nameof<FormDataState>((o) => o.birthYear)}
            label={t('home:application-form.personal-information.birth-year')}
            value={formData.birthYear?.toString()}
            onChange={onFieldChange}
            options={yearOfBirthOptions}
            required
            gutterBottom
          />

          <CheckboxeField
            field={nameof<FormDataState>((o) => o.isProvinceMajorCertified)}
            label={t('home:application-form.personal-information.is-province-major-certified')}
            checked={formData.isProvinceMajorCertified}
            onChange={onCheckboxFieldChange}
            required
          />
          <div className="tw-mb-8 tw-pl-10">
            <a href="http://example.com" target="_blank" rel="noreferrer">
              {t('home:application-form.personal-information.is-province-major-certified-link')}
            </a>
          </div>

          <SelectField field={nameof<FormDataState>((o) => o.languageId)} label={t('home:application-form.personal-information.language')} value={formData.languageId} onChange={onFieldChange} options={preferedLanguageOptions} required gutterBottom />

          <SelectField
            field={nameof<FormDataState>((o) => o.isCanadianCitizen)}
            label={t('home:application-form.personal-information.is-canadien-citizen.label')}
            value={formData.isCanadianCitizen?.toString()}
            onChange={onFieldChange}
            options={yesNoOptions}
            helperText={t('home:application-form.personal-information.is-canadien-citizen.helper-text')}
            required
            gutterBottom
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.provinceId)}
            label={t('home:application-form.personal-information.province')}
            value={formData.provinceId}
            onChange={onFieldChange}
            options={provinceOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.genderId)}
            label={t('home:application-form.personal-information.gender')}
            value={formData.genderId}
            onChange={onFieldChange}
            options={genderOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <ContentPaper>
            <h5 className="tw-m-0 tw-mb-8 tw-text-lg">{t('home:application-form.personal-information.identity.header')}</h5>

            <SelectField
              field={nameof<FormDataState>((o) => o.isDisabled)}
              label={t('home:application-form.personal-information.identity.is-disabled')}
              labelClassName="tw-font-normal"
              value={formData.isDisabled === null ? 'none' : formData.isDisabled?.toString()}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.isMinority)}
              label={t('home:application-form.personal-information.identity.is-minority')}
              labelClassName="tw-font-normal"
              value={formData.isMinority === null ? 'none' : formData.isMinority?.toString()}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.indigenousTypeId)}
              label={t('home:application-form.personal-information.identity.indigenous-type')}
              labelClassName="tw-font-normal"
              value={formData.indigenousTypeId}
              onChange={onFieldChange}
              options={indigenousTypeOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.isLgbtq)}
              label={t('home:application-form.personal-information.identity.is-lgbtq')}
              labelClassName="tw-font-normal"
              value={formData.isLgbtq === null ? 'none' : formData.isLgbtq?.toString()}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.isRural)}
              label={t('home:application-form.personal-information.identity.is-rural')}
              labelClassName="tw-font-normal"
              value={formData.isRural === null ? 'none' : formData.isRural?.toString()}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              gutterBottom
              className="tw-w-6/12 md:tw-w-4/12"
            />

            <SelectField
              field={nameof<FormDataState>((o) => o.isNewcomer)}
              label={t('home:application-form.personal-information.identity.is-newcomer')}
              labelClassName="tw-font-normal"
              value={formData.isNewcomer === null ? 'none' : formData.isNewcomer?.toString()}
              onChange={onFieldChange}
              options={yesNoNoPreferNotAnswerOptions}
              required
              className="tw-w-6/12 md:tw-w-4/12"
            />
          </ContentPaper>

          <SelectField
            field={nameof<FormDataState>((o) => o.educationLevelId)}
            label={t('home:application-form.personal-information.education-level.label')}
            helperText={t('home:application-form.personal-information.education-level.helper-text')}
            value={formData.educationLevelId}
            onChange={onFieldChange}
            options={educationLevelOptions}
            required
            className="tw-w-full md:tw-w-8/12"
          />

          <h4 className="tw-border-b-2 tw-pb-5 tw-mt-20 tw-mb-16 tw-text-xl">{t('home:application-form.expression-of-interest-questions.header')}</h4>

          <TextAreaField
            field={nameof<FormDataState>((o) => o.skillsInterest)}
            label={t('home:application-form.expression-of-interest-questions.skills-interest')}
            value={formData.skillsInterest}
            onChange={onFieldChange}
            required
            gutterBottom
            className="tw-w-full"
          />

          <TextAreaField
            field={nameof<FormDataState>((o) => o.communityInterest)}
            label={t('home:application-form.expression-of-interest-questions.community-interest')}
            value={formData.communityInterest}
            onChange={onFieldChange}
            required
            gutterBottom
            className="tw-w-full"
          />

          <TextAreaField
            field={nameof<FormDataState>((o) => o.programInterest)}
            label={t('home:application-form.expression-of-interest-questions.program-interest')}
            value={formData.programInterest}
            onChange={onFieldChange}
            gutterBottom
            className="tw-w-full"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.internetQualityId)}
            label={t('home:application-form.expression-of-interest-questions.internet-quality')}
            value={formData.internetQualityId}
            onChange={onFieldChange}
            options={internetQualityOptions}
            required
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <SelectField
            field={nameof<FormDataState>((o) => o.hasDedicatedDevice)}
            label={t('home:application-form.expression-of-interest-questions.has-dedicated-device')}
            value={formData.hasDedicatedDevice?.toString()}
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
            <CheckboxeField field={nameof<FormDataState>((o) => o.isInformationConsented)} label={t('home:application-form.is-information-consented')} checked={formData.isInformationConsented} onChange={onCheckboxFieldChange} />
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
