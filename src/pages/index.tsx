/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import type { CheckboxeFieldOnChangeEvent } from '../components/form/CheckboxeField';
import { CheckboxeField } from '../components/form/CheckboxeField';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../components/form/RadiosField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../components/form/SelectField';
import { SelectField } from '../components/form/SelectField';
import type { TextAreaFieldOnChangeEvent } from '../components/form/TextAreaField';
import { TextAreaField } from '../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../components/form/TextField';
import { TextField } from '../components/form/TextField';
import { MainLayout } from '../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent, WizardOnSubmitClickEvent } from '../components/Wizard';
import { WizardStep } from '../components/WizardStep';
import { theme } from '../config';
import useEducationLevels, { educationLevelStaticProps } from '../hooks/api/useEducationLevels';
import useGenders, { genderStaticProps } from '../hooks/api/useGenders';
import useIndigenousTypes, { indigenousTypeStaticProps } from '../hooks/api/useIndigenousTypes';
import useInternetQualities, { internetQualitiesStaticProps } from '../hooks/api/useInternetQualities';
import useLanguages, { languagesStaticProps } from '../hooks/api/useLanguages';
import useProvinces, { provincesStaticProps } from '../hooks/api/useProvinces';
import useSubmitApplication from '../hooks/api/useSubmitApplication';
import useCurrentBreakpoint from '../hooks/useCurrentBreakpoint';
import { getYears } from '../utils/misc-utils';
import Error from './_error';

export interface GetDescriptionFunc {
  (obj: { descriptionFr: string; descriptionEn: string }): string;
}

interface FormDataState {
  [key: string]: boolean | string | number | null | undefined;
  birthYear?: number;
  communityInterest?: string;
  educationLevelId?: string | null;
  email?: string;
  firstName?: string;
  genderId?: string | null;
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
const NO_ANSWER_VALUE = '--prefer-not-answer';

const Home: NextPage = () => {
  const currentBreakpoint = useCurrentBreakpoint();
  const { lang, t } = useTranslation();
  const { isLoading: isSubmitting, error: submitError, data: submitData, mutate: submitApplication } = useSubmitApplication();

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

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      let newValue = undefined;

      if (value) {
        if (value.toLowerCase() === 'true') newValue = true;
        else if (value.toLowerCase() === 'false') newValue = false;
        else if (value.toLowerCase() === NO_ANSWER_VALUE.toLowerCase()) newValue = null;
        else if (!isNaN(Number(value))) newValue = Number(value);
        else newValue = value;
      }

      return { ...prev, [field as keyof FormDataState]: newValue };
    });
  };

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: value ?? undefined }));
  };

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: checked }));
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    return true;
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = (event) => {
    event.preventDefault();
    return true;
  };

  const handleWizardOnSubmitClick: WizardOnSubmitClickEvent = (event) => {
    event.preventDefault();
    submitApplication({
      birthYear: formData.birthYear,
      communityInterest: formData.communityInterest,
      educationLevelId: formData.educationLevelId ?? undefined,
      email: formData.email,
      firstName: formData.firstName,
      genderId: formData.genderId ?? undefined,
      hasDedicatedDevice: formData.hasDedicatedDevice,
      indigenousTypeId: formData.indigenousTypeId,
      internetQualityId: formData.internetQualityId,
      isCanadianCitizen: formData.isCanadianCitizen,
      isDisabled: formData.isDisabled ?? undefined,
      isLgbtq: formData.isLgbtq ?? undefined,
      isMinority: formData.isMinority ?? undefined,
      isNewcomer: formData.isNewcomer ?? undefined,
      isRural: formData.isRural ?? undefined,
      languageId: formData.languageId,
      lastName: formData.lastName,
      miscInterest: formData.miscInterest,
      programInterest: formData.programInterest,
      provinceId: formData.provinceId,
      skillsInterest: formData.skillsInterest ?? undefined,
    });
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // year of birth select options
  const yearOfBirthOptions = useMemo<SelectFieldOption[]>(() => getYears({ startYear: 1990, endYear: 2003 }).map((year) => ({ value: year.toString(), text: `${year}` })), []);

  // prefered language select options
  const preferedLanguageOptions = useMemo<RadiosFieldOption[]>(() => {
    if (isLanguagesLoading || languagesError) return [];
    return languages?._embedded.languages.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isLanguagesLoading, languagesError, languages, getDescription]);

  // province select options
  const provinceOptions = useMemo<SelectFieldOption[]>(() => {
    if (isProvincesLoading || provincesError) return [];

    const options = provinces?._embedded.provinces.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];

    options.sort((a, b) => a.text.localeCompare(b.text));

    return options;
  }, [isProvincesLoading, provincesError, provinces, getDescription]);

  // gender select options
  const genderOptions = useMemo<SelectFieldOption[]>(() => {
    if (isGendersLoading || gendersError) return [];
    return [...(genders?._embedded.genders.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: NO_ANSWER_VALUE, text: t('common:prefer-not-answer') }];
  }, [t, isGendersLoading, gendersError, genders, getDescription]);

  // education level select options
  const educationLevelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isEducationLevelsLoading || educationLevelsError) return [];
    return [...(educationLevels?._embedded.educationLevels.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: NO_ANSWER_VALUE, text: t('common:prefer-not-answer') }];
  }, [t, isEducationLevelsLoading, educationLevelsError, educationLevels, getDescription]);

  // indigenous types select options
  const indigenousTypeOptions = useMemo<SelectFieldOption[]>(() => {
    if (isIndigenousTypesLoading || indigenousTypesError) return [];
    return [...(indigenousTypes?._embedded.indigenousTypes.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: NO_ANSWER_VALUE, text: t('common:prefer-not-answer') }];
  }, [t, isIndigenousTypesLoading, indigenousTypesError, indigenousTypes, getDescription]);

  // internet quality select options
  const internetQualityOptions = useMemo<SelectFieldOption[]>(() => {
    if (isInternetQualitiesLoading || internetQualitiesError) return [];
    return [...(internetQualities?._embedded.internetQualities.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: NO_ANSWER_VALUE, text: t('common:no') }];
  }, [t, isInternetQualitiesLoading, internetQualitiesError, internetQualities, getDescription]);

  // access dedicated device select options
  const hearAboutCPPOptions = useMemo<SelectFieldOption[]>(
    () => [
      { value: 'word-of-mouth', text: 'Word of mouth' },
      { value: 'search-engine', text: 'Search engine' },
      { value: 'other', text: 'Other' },
    ],
    []
  );

  const yesNoOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: true.toString(), text: t('common:yes') },
      { value: false.toString(), text: t('common:no') },
    ],
    [t]
  );

  const yesNoNoPreferNotAnswerOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: true.toString(), text: t('common:yes') },
      { value: false.toString(), text: t('common:no') },
      { value: NO_ANSWER_VALUE, text: t('common:prefer-not-answer') },
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
      <h2 className="tw-border-b-2 tw-pb-4 tw-m-0 tw-mb-8 tw-text-2xl">{t('home:page.header')}</h2>
      {isEducationLevelsLoading || isGendersLoading || isIndigenousTypesLoading || isInternetQualitiesLoading || isLanguagesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <h3 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('home:application-form.header')}</h3>
          <Wizard stepText={t('home:application-form.wizard-step')} submitText={t('home:application-form.submit')} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick} onSubmitClick={handleWizardOnSubmitClick}>
            <WizardStep header={t('home:application-form.step.personal-information')}>
              <>
                <TextField
                  field={nameof<FormDataState>((o) => o.firstName)}
                  label={t('home:application-form.field.first-name')}
                  value={formData.firstName}
                  onChange={handleOnTextFieldChange}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
                />

                <TextField
                  field={nameof<FormDataState>((o) => o.lastName)}
                  label={t('home:application-form.field.last-name')}
                  value={formData.lastName}
                  onChange={handleOnTextFieldChange}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
                />

                <TextField
                  field={nameof<FormDataState>((o) => o.email)}
                  label={t('home:application-form.field.email-address')}
                  value={formData.email}
                  onChange={handleOnTextFieldChange}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.birthYear)}
                  label={t('home:application-form.field.birth-year.label')}
                  helperText={t('home:application-form.field.birth-year.helper-text')}
                  value={formData.birthYear?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yearOfBirthOptions}
                  required
                  gutterBottom
                />

                <CheckboxeField
                  field={nameof<FormDataState>((o) => o.isProvinceMajorCertified)}
                  label={t('home:application-form.field.is-province-major-certified')}
                  checked={formData.isProvinceMajorCertified}
                  onChange={handleOnCheckboxFieldChange}
                  required
                />
                <div className="tw-mb-8 tw-pl-10">
                  <a href="http://example.com" target="_blank" rel="noreferrer">
                    {t('home:application-form.field.is-province-major-certified-link')}
                  </a>
                </div>

                <RadiosField
                  field={nameof<FormDataState>((o) => o.languageId)}
                  label={t('home:application-form.field.language')}
                  value={formData.languageId}
                  onChange={handleOnOptionsFieldChange}
                  options={preferedLanguageOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.isCanadianCitizen)}
                  label={t('home:application-form.field.is-canadien-citizen.label')}
                  value={formData.isCanadianCitizen?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  helperText={t('home:application-form.field.is-canadien-citizen.helper-text')}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.provinceId)}
                  label={t('home:application-form.field.province')}
                  value={formData.provinceId}
                  onChange={handleOnOptionsFieldChange}
                  options={provinceOptions}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.genderId)}
                  label={t('home:application-form.field.gender')}
                  value={formData.genderId === null ? NO_ANSWER_VALUE : formData.genderId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={genderOptions}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.educationLevelId)}
                  label={t('home:application-form.field.education-level.label')}
                  helperText={t('home:application-form.field.education-level.helper-text')}
                  value={formData.educationLevelId === null ? NO_ANSWER_VALUE : formData.educationLevelId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={educationLevelOptions}
                  required
                  className="tw-w-full"
                />
              </>
            </WizardStep>
            <WizardStep header={t('home:application-form.step.identity')}>
              <>
                <RadiosField
                  field={nameof<FormDataState>((o) => o.isDisabled)}
                  label={t('home:application-form.field.is-disabled')}
                  value={formData.isDisabled === null ? NO_ANSWER_VALUE : formData.isDisabled?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.isMinority)}
                  label={t('home:application-form.field.is-minority')}
                  value={formData.isMinority === null ? NO_ANSWER_VALUE : formData.isMinority?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.indigenousTypeId)}
                  label={t('home:application-form.field.indigenous-type')}
                  value={formData.indigenousTypeId === null ? NO_ANSWER_VALUE : formData.indigenousTypeId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={indigenousTypeOptions}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.isLgbtq)}
                  label={t('home:application-form.field.is-lgbtq')}
                  value={formData.isLgbtq === null ? NO_ANSWER_VALUE : formData.isLgbtq?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.isRural)}
                  label={t('home:application-form.field.is-rural')}
                  value={formData.isRural === null ? NO_ANSWER_VALUE : formData.isRural?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.isNewcomer)}
                  label={t('home:application-form.field.is-newcomer')}
                  value={formData.isNewcomer === null ? NO_ANSWER_VALUE : formData.isNewcomer?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  required
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />
              </>
            </WizardStep>
            <WizardStep header={t('home:application-form.step.expression-of-interest-questions')}>
              <>
                <TextAreaField
                  field={nameof<FormDataState>((o) => o.skillsInterest)}
                  label={t('home:application-form.field.skills-interest')}
                  value={formData.skillsInterest}
                  onChange={handleOnTextFieldChange}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField
                  field={nameof<FormDataState>((o) => o.communityInterest)}
                  label={t('home:application-form.field.community-interest')}
                  value={formData.communityInterest}
                  onChange={handleOnTextFieldChange}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField field={nameof<FormDataState>((o) => o.programInterest)} label={t('home:application-form.field.program-interest')} value={formData.programInterest} onChange={handleOnOptionsFieldChange} className="tw-w-full" wordLimit={250} />
              </>
            </WizardStep>
            <WizardStep header={t('home:application-form.step.consent')}>
              <>
                <SelectField
                  field={nameof<FormDataState>((o) => o.internetQualityId)}
                  label={t('home:application-form.field.internet-quality')}
                  value={formData.internetQualityId}
                  onChange={handleOnOptionsFieldChange}
                  options={internetQualityOptions}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<FormDataState>((o) => o.hasDedicatedDevice)}
                  label={t('home:application-form.field.has-dedicated-device')}
                  value={formData.hasDedicatedDevice?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<FormDataState>((o) => o.hearAboutCPP)}
                  label={t('home:application-form.field.hear-about-cpp')}
                  value={formData.hearAboutCPP}
                  onChange={handleOnOptionsFieldChange}
                  options={hearAboutCPPOptions}
                  required
                  className="tw-w-full sm:tw-w-6/12"
                  gutterBottom
                />

                <CheckboxeField field={nameof<FormDataState>((o) => o.isInformationConsented)} label={t('home:application-form.field.is-information-consented')} checked={formData.isInformationConsented} onChange={handleOnCheckboxFieldChange} />
              </>
            </WizardStep>
          </Wizard>
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
