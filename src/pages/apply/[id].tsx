/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo, useState, useEffect, useCallback } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import type { CheckboxeFieldOnChangeEvent } from '../../components/form/CheckboxeField';
import { CheckboxeField } from '../../components/form/CheckboxeField';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../../components/form/RadiosField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../components/form/SelectField';
import { SelectField } from '../../components/form/SelectField';
import type { TextAreaFieldOnChangeEvent } from '../../components/form/TextAreaField';
import { TextAreaField } from '../../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../../components/form/TextField';
import { TextField } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent, WizardOnSubmitClickEvent } from '../../components/Wizard';
import { WizardStep } from '../../components/WizardStep';
import { theme } from '../../config';
import useDiscoveryChannels, { discoveryChannelsStaticProps, discoveryChannelsQueryKey } from '../../hooks/api/useDiscoveryChannels';
import useEducationLevels, { educationLevelStaticProps, educationLevelsQueryKey } from '../../hooks/api/useEducationLevels';
import useGenders, { genderStaticProps, gendersQueryKey } from '../../hooks/api/useGenders';
import useIndigenousTypes, { indigenousTypeStaticProps, indigenousTypesQueryKey } from '../../hooks/api/useIndigenousTypes';
import useInternetQualities, { internetQualitiesStaticProps, internetQualitiesQueryKey } from '../../hooks/api/useInternetQualities';
import useLanguages, { languagesStaticProps, languagesQueryKey } from '../../hooks/api/useLanguages';
import useProvinces, { provincesStaticProps, provincesQueryKey } from '../../hooks/api/useProvinces';
import useSubmitApplication from '../../hooks/api/useSubmitApplication';
import useCurrentBreakpoint from '../../hooks/useCurrentBreakpoint';
import { getYears } from '../../utils/misc-utils';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../_error';
import Alert, { AlertType } from '../../components/Alert/Alert';
import { ApplyState, ConsentState, ExpressionOfInterestState, GetDescriptionFunc, IdentityInformationState, PersonalInformationState, Constants } from './types';
import { consentSchema, expressionOfInterestSchema, identityInformationSchema, personalInformationSchema, formSchema } from './validationSchemas';
import { AnyObjectSchema, ValidationError } from 'yup';

export interface ApplySectionProps {
  id: string;
}

const _sectionIds = nameof.toArray<ApplyState>((o) => [o.personalInformation, o.identityInformation, o.expressionOfInterest, o.consent]);

const ApplySection = ({ id }: ApplySectionProps): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { isLoading: isSubmitting, error: submitError, mutate: submitApplication } = useSubmitApplication();

  const { data: discoveryChannels, isLoading: isDiscoveryChannelsLoading, error: discoveryChannelsError } = useDiscoveryChannels();
  const { data: educationLevels, isLoading: isEducationLevelsLoading, error: educationLevelsError } = useEducationLevels();
  const { data: genders, isLoading: isGendersLoading, error: gendersError } = useGenders();
  const { data: indigenousTypes, isLoading: isIndigenousTypesLoading, error: indigenousTypesError } = useIndigenousTypes();
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities();
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces();

  const [fieldValidationErrors, setfieldValidationErrors] = useState<string[] | null>();

  const [formData, setFormDataState] = useState<ApplyState>(() => {
    const defaultState: ApplyState = { personalInformation: {}, identityInformation: {}, expressionOfInterest: {}, consent: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  const idCamelCase = useMemo(() => camelCase(id.toLowerCase()), [id]);

  useEffect(() => {
    window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
  }, [formData]);

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      const sectionId = _sectionIds.find((sId) => sId === idCamelCase);
      if (!sectionId) return prev;

      let newValue = undefined;

      if (value) {
        if (value.toLowerCase() === 'true') newValue = true;
        else if (value.toLowerCase() === 'false') newValue = false;
        else if (value.toLowerCase() === Constants.NoAnswerOptionValue.toLowerCase()) newValue = null;
        else if (!isNaN(Number(value))) newValue = Number(value);
        else newValue = value;
      }

      const newObj = { ...prev[sectionId as keyof ApplyState], [field]: newValue };
      return { ...prev, [sectionId as keyof ApplyState]: newObj };
    });
  };

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      const sectionId = _sectionIds.find((sId) => sId === idCamelCase);
      if (!sectionId) return prev;

      const newObj = { ...prev[sectionId as keyof ApplyState], [field]: value ?? undefined };
      return { ...prev, [sectionId as keyof ApplyState]: newObj };
    });
  };

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => {
      const sectionId = _sectionIds.find((sId) => sId === idCamelCase);
      if (!sectionId) return prev;

      const newObj = { ...prev[sectionId as keyof ApplyState], [field]: checked };
      return { ...prev, [sectionId as keyof ApplyState]: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event, activeStepId, nextStepId) => {
    event.preventDefault();

    router.push(`/apply/${kebabCase(nextStepId)}`);
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event, activeStepId, nextStepId) => {
    event.preventDefault();

    let schema: AnyObjectSchema | null = null;
    let schemaValue: PersonalInformationState | IdentityInformationState | ExpressionOfInterestState | null = null;
    let valid = false;

    // Personal information
    if (activeStepId === nameof<ApplyState>((o) => o.personalInformation)) {
      schema = personalInformationSchema;
      schemaValue = formData.personalInformation;
    }
    // Identity information
    else if (activeStepId === nameof<ApplyState>((o) => o.identityInformation)) {
      schema = identityInformationSchema;
      schemaValue = formData.identityInformation;
    }
    // Expression of interest
    else if (activeStepId === nameof<ApplyState>((o) => o.expressionOfInterest)) {
      schema = expressionOfInterestSchema;
      schemaValue = formData.expressionOfInterest;
    }

    if (schema && schemaValue)
      try {
        await schema.validate(schemaValue, { abortEarly: false });
        valid = true;
      } catch (err) {
        if (err instanceof ValidationError) {
          setfieldValidationErrors(err.errors);
          window.scroll({ top: 0, behavior: 'smooth' });
        } else {
          throw err;
        }
      }

    if (valid) {
      setfieldValidationErrors(null);
      router.push(`/apply/${kebabCase(nextStepId)}`);
    }
  };

  const handleWizardOnSubmitClick: WizardOnSubmitClickEvent = async (event, activeStepId) => {
    event.preventDefault();

    if (activeStepId === nameof<ApplyState>((o) => o.consent)) {
      let valid = false;

      try {
        // validate active step schema
        await consentSchema.validate(formData.consent, { abortEarly: false });

        // validate form schema
        await formSchema.validate(formData, { abortEarly: false });

        valid = true;
      } catch (err) {
        if (err instanceof ValidationError) {
          setfieldValidationErrors(err.errors);
          window.scroll({ top: 0, behavior: 'smooth' });
        } else {
          throw err;
        }
      }

      if (valid) {
        setfieldValidationErrors(null);
        submitApplication({
          ...formData.personalInformation,
          ...formData.identityInformation,
          ...formData.expressionOfInterest,
          ...formData.consent,
        });
      }
    }
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
    return (provinces?._embedded.provinces.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []).sort((a, b) => a.text.localeCompare(b.text));
  }, [isProvincesLoading, provincesError, provinces, getDescription]);

  // gender select options
  const genderOptions = useMemo<SelectFieldOption[]>(() => {
    if (isGendersLoading || gendersError) return [];
    return [...(genders?._embedded.genders.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') }];
  }, [t, isGendersLoading, gendersError, genders, getDescription]);

  // education level select options
  const educationLevelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isEducationLevelsLoading || educationLevelsError) return [];
    return [...(educationLevels?._embedded.educationLevels.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') }];
  }, [t, isEducationLevelsLoading, educationLevelsError, educationLevels, getDescription]);

  // indigenous types select options
  const indigenousTypeOptions = useMemo<SelectFieldOption[]>(() => {
    if (isIndigenousTypesLoading || indigenousTypesError) return [];
    return [...(indigenousTypes?._embedded.indigenousTypes.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') }];
  }, [t, isIndigenousTypesLoading, indigenousTypesError, indigenousTypes, getDescription]);

  // internet quality select options
  const internetQualityOptions = useMemo<SelectFieldOption[]>(() => {
    if (isInternetQualitiesLoading || internetQualitiesError) return [];
    return internetQualities?._embedded.internetQualities.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isInternetQualitiesLoading, internetQualitiesError, internetQualities, getDescription]);

  // discovery channel select options
  const discoveryChannelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isDiscoveryChannelsLoading || discoveryChannelsError) return [];
    return discoveryChannels?._embedded.discoveryChannels.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isDiscoveryChannelsLoading, discoveryChannelsError, discoveryChannels, getDescription]);

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
      { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') },
    ],
    [t]
  );

  if (discoveryChannelsError || educationLevelsError || gendersError || indigenousTypesError || internetQualitiesError || internetQualitiesError || languagesError || provincesError) {
    return <Error err={(discoveryChannelsError ?? educationLevelsError ?? gendersError ?? indigenousTypesError ?? internetQualitiesError ?? internetQualitiesError ?? languagesError ?? provincesError) as Error} />;
  }

  console.log(kebabCase(nameof<PersonalInformationState>((o) => o.isProvinceMajorCertified)));

  return (
    <MainLayout showBreadcrumb={false}>
      <NextSeo title={t('apply:application-form.header')} />
      <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
        {t('common:app.title')}
      </h1>
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('apply:application-form.header')}</h2>
      {isDiscoveryChannelsLoading || isEducationLevelsLoading || isGendersLoading || isIndigenousTypesLoading || isInternetQualitiesLoading || isLanguagesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          {submitError && (
            <Alert title="Submit Error" description="Please review try later." type={AlertType.danger}>
              <pre className="tw-hidden">{JSON.stringify(submitError)}</pre>
            </Alert>
          )}

          {fieldValidationErrors && (
            <Alert title="Validation Error" description="Please review fields in highlighted in red." type={AlertType.danger}>
              {fieldValidationErrors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </Alert>
          )}

          <Wizard
            activeStepId={idCamelCase}
            stepText={t('apply:application-form.wizard-step')}
            submitText={t('apply:application-form.submit')}
            onNextClick={handleWizardOnNextClick}
            onPreviousClick={handleWizardOnPreviousClick}
            onSubmitClick={handleWizardOnSubmitClick}
            disabled={isSubmitting}>
            <WizardStep id={nameof<ApplyState>((o) => o.personalInformation)} header={t('apply:application-form.step.personal-information')}>
              <>
                <TextField
                  field={nameof<PersonalInformationState>((o) => o.firstName)}
                  label={t('apply:application-form.field.first-name')}
                  value={formData.personalInformation.firstName}
                  onChange={handleOnTextFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.firstName))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
                />

                <TextField
                  field={nameof<PersonalInformationState>((o) => o.lastName)}
                  label={t('apply:application-form.field.last-name')}
                  value={formData.personalInformation.lastName}
                  onChange={handleOnTextFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.lastName))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
                />

                <TextField
                  field={nameof<PersonalInformationState>((o) => o.email)}
                  label={t('apply:application-form.field.email-address')}
                  value={formData.personalInformation.email}
                  onChange={handleOnTextFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.email))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
                />

                <SelectField
                  field={nameof<PersonalInformationState>((o) => o.birthYear)}
                  label={t('apply:application-form.field.birth-year.label')}
                  helperText={t('apply:application-form.field.birth-year.helper-text')}
                  value={formData.personalInformation.birthYear?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yearOfBirthOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.birthYear))))}
                  required
                  gutterBottom
                />

                <CheckboxeField
                  field={nameof<PersonalInformationState>((o) => o.isProvinceMajorCertified)}
                  label={t('apply:application-form.field.is-province-major-certified')}
                  checked={formData.personalInformation.isProvinceMajorCertified}
                  onChange={handleOnCheckboxFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.isProvinceMajorCertified))))}
                  required
                />
                <div className="tw-mb-8 tw-pl-10">
                  <a href="http://example.com" target="_blank" rel="noreferrer">
                    {t('apply:application-form.field.is-province-major-certified-link')}
                  </a>
                </div>

                <RadiosField
                  field={nameof<PersonalInformationState>((o) => o.languageId)}
                  label={t('apply:application-form.field.language')}
                  value={formData.personalInformation.languageId}
                  onChange={handleOnOptionsFieldChange}
                  options={preferedLanguageOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.languageId))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<PersonalInformationState>((o) => o.isCanadianCitizen)}
                  label={t('apply:application-form.field.is-canadien-citizen.label')}
                  value={formData.personalInformation.isCanadianCitizen?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  helperText={t('apply:application-form.field.is-canadien-citizen.helper-text')}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.isCanadianCitizen))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<PersonalInformationState>((o) => o.provinceId)}
                  label={t('apply:application-form.field.province')}
                  value={formData.personalInformation.provinceId}
                  onChange={handleOnOptionsFieldChange}
                  options={provinceOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.provinceId))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <SelectField
                  field={nameof<PersonalInformationState>((o) => o.genderId)}
                  label={t('apply:application-form.field.gender')}
                  value={formData.personalInformation.genderId === null ? Constants.NoAnswerOptionValue : formData.personalInformation.genderId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={genderOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.genderId))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <SelectField
                  field={nameof<PersonalInformationState>((o) => o.educationLevelId)}
                  label={t('apply:application-form.field.education-level.label')}
                  helperText={t('apply:application-form.field.education-level.helper-text')}
                  value={formData.personalInformation.educationLevelId === null ? Constants.NoAnswerOptionValue : formData.personalInformation.educationLevelId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={educationLevelOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<PersonalInformationState>((o) => o.educationLevelId))))}
                  required
                  className="tw-w-full"
                />
              </>
            </WizardStep>
            <WizardStep id={nameof<ApplyState>((o) => o.identityInformation)} header={t('apply:application-form.step.identity')}>
              <>
                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isDisabled)}
                  label={t('apply:application-form.field.is-disabled')}
                  value={formData.identityInformation.isDisabled === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isDisabled?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.isDisabled))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isMinority)}
                  label={t('apply:application-form.field.is-minority')}
                  value={formData.identityInformation.isMinority === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isMinority?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.isMinority))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<IdentityInformationState>((o) => o.indigenousTypeId)}
                  label={t('apply:application-form.field.indigenous-type')}
                  value={formData.identityInformation.indigenousTypeId === null ? Constants.NoAnswerOptionValue : formData.identityInformation.indigenousTypeId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={indigenousTypeOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.indigenousTypeId))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isLgbtq)}
                  label={t('apply:application-form.field.is-lgbtq')}
                  value={formData.identityInformation.isLgbtq === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isLgbtq?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.isLgbtq))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isRural)}
                  label={t('apply:application-form.field.is-rural')}
                  value={formData.identityInformation.isRural === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isRural?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.isRural))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isNewcomer)}
                  label={t('apply:application-form.field.is-newcomer')}
                  value={formData.identityInformation.isNewcomer === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isNewcomer?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<IdentityInformationState>((o) => o.isNewcomer))))}
                  required
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />
              </>
            </WizardStep>
            <WizardStep id={nameof<ApplyState>((o) => o.expressionOfInterest)} header={t('apply:application-form.step.expression-of-interest-questions')}>
              <>
                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.skillsInterest)}
                  label={t('apply:application-form.field.skills-interest')}
                  value={formData.expressionOfInterest.skillsInterest}
                  onChange={handleOnTextFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ExpressionOfInterestState>((o) => o.skillsInterest))))}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.communityInterest)}
                  label={t('apply:application-form.field.community-interest')}
                  value={formData.expressionOfInterest.communityInterest}
                  onChange={handleOnTextFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ExpressionOfInterestState>((o) => o.communityInterest))))}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.programInterest)}
                  label={t('apply:application-form.field.program-interest')}
                  value={formData.expressionOfInterest.programInterest}
                  onChange={handleOnOptionsFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ExpressionOfInterestState>((o) => o.programInterest))))}
                  className="tw-w-full"
                  wordLimit={250}
                />
              </>
            </WizardStep>
            <WizardStep id={nameof<ApplyState>((o) => o.consent)} header={t('apply:application-form.step.consent')}>
              <>
                <SelectField
                  field={nameof<ConsentState>((o) => o.internetQualityId)}
                  label={t('apply:application-form.field.internet-quality')}
                  value={formData.consent.internetQualityId}
                  onChange={handleOnOptionsFieldChange}
                  options={internetQualityOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ConsentState>((o) => o.internetQualityId))))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<ConsentState>((o) => o.hasDedicatedDevice)}
                  label={t('apply:application-form.field.has-dedicated-device')}
                  value={formData.consent.hasDedicatedDevice?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ConsentState>((o) => o.hasDedicatedDevice))))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<ConsentState>((o) => o.discoveryChannelId)}
                  label={t('apply:application-form.field.discovery-channel')}
                  value={formData.consent.discoveryChannelId}
                  onChange={handleOnOptionsFieldChange}
                  options={discoveryChannelOptions}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ConsentState>((o) => o.discoveryChannelId))))}
                  required
                  className="tw-w-full sm:tw-w-6/12"
                  gutterBottom
                />

                <CheckboxeField
                  field={nameof<ConsentState>((o) => o.isInformationConsented)}
                  label={t('apply:application-form.field.is-information-consented')}
                  checked={formData.consent.isInformationConsented}
                  onChange={handleOnCheckboxFieldChange}
                  disabled={isSubmitting}
                  error={fieldValidationErrors?.some((err) => err.startsWith(kebabCase(nameof<ConsentState>((o) => o.isInformationConsented))))}
                />
              </>
            </WizardStep>
          </Wizard>
        </>
      )}
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const stepIds: string[] = nameof.toArray<ApplyState>((o) => [o.personalInformation, o.identityInformation, o.expressionOfInterest, o.consent]);

  // create paths
  let paths: Array<{ params: { id: string }; locale: string }> = [];

  locales?.forEach((locale) => {
    paths = [...paths, ...stepIds.map((stepId) => ({ params: { id: kebabCase(stepId) }, locale }))];
  });

  return {
    paths,
    fallback: false,
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(discoveryChannelsQueryKey, () => discoveryChannelsStaticProps);
  await queryClient.prefetchQuery(educationLevelsQueryKey, () => educationLevelStaticProps);
  await queryClient.prefetchQuery(gendersQueryKey, () => genderStaticProps);
  await queryClient.prefetchQuery(indigenousTypesQueryKey, () => indigenousTypeStaticProps);
  await queryClient.prefetchQuery(internetQualitiesQueryKey, () => internetQualitiesStaticProps);
  await queryClient.prefetchQuery(languagesQueryKey, () => languagesStaticProps);
  await queryClient.prefetchQuery(provincesQueryKey, () => provincesStaticProps);

  return {
    props: {
      id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ApplySection;
