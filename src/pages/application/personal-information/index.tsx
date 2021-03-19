/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo, useState, useEffect, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { CheckboxeFieldOnChangeEvent } from '../../../components/form/CheckboxeField';
import { CheckboxeField } from '../../../components/form/CheckboxeField';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../../../components/form/RadiosField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../../components/form/SelectField';
import { SelectField } from '../../../components/form/SelectField';
import type { TextAreaFieldOnChangeEvent } from '../../../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../../../components/form/TextField';
import { TextField } from '../../../components/form/TextField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent } from '../../../components/Wizard';
import { theme } from '../../../config';
import { useDiscoveryChannels } from '../../../hooks/api/code-lookups/useDiscoveryChannels';
import { useInternetQualities } from '../../../hooks/api/code-lookups/useInternetQualities';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { useCurrentBreakpoint } from '../../../hooks/useCurrentBreakpoint';
import { getYears } from '../../../utils/misc-utils';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import { Alert, AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, GetDescriptionFunc, PersonalInformationState, Constants } from '../types';
import { personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';

const ApplicationPersonalInformationPage = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { data: discoveryChannels, isLoading: isDiscoveryChannelsLoading, error: discoveryChannelsError } = useDiscoveryChannels({ lang });
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities({ lang });
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages({ lang });
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces({ lang });

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const [formData, setFormDataState] = useState<ApplicationState>(() => {
    const defaultState: ApplicationState = { personalInformation: {}, identityInformation: {}, expressionOfInterest: {}, consent: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  useEffect(() => {
    window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
  }, [formData]);

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      let newValue: boolean | string | number | null | undefined = undefined;

      if (value) {
        if (value.toLowerCase() === 'true') newValue = true;
        else if (value.toLowerCase() === 'false') newValue = false;
        else if (!isNaN(Number(value))) newValue = Number(value);
        else newValue = value;
      }

      const newObj = { ...prev.personalInformation, [field]: newValue };
      return { ...prev, personalInformation: newObj };
    });
  };

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      const newObj = { ...prev.personalInformation, [field]: value ?? undefined };
      return { ...prev, personalInformation: newObj };
    });
  };

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => {
      const newObj = { ...prev.personalInformation, [field]: checked };
      return { ...prev, personalInformation: newObj };
    });
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await personalInformationSchema.validate(formData.personalInformation, { abortEarly: false });
      router.push('/application/identity-information');
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push('/application/personal-information#wb-cont', undefined, { shallow: true });
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // year of birth select options
  const yearOfBirthOptions = useMemo<SelectFieldOption[]>(() => getYears({ startYear: 1990, endYear: 2003 }).map((year) => ({ value: year.toString(), text: year.toString() })), []);

  // prefered language select options
  const preferedLanguageOptions = useMemo<RadiosFieldOption[]>(() => {
    if (isLanguagesLoading || languagesError) return [];
    return languages?._embedded.languages.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isLanguagesLoading, languagesError, languages, getDescription]);

  // province select options
  const provinceOptions = useMemo<SelectFieldOption[]>(() => {
    if (isProvincesLoading || provincesError) return [];
    return provinces?._embedded.provinces.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isProvincesLoading, provincesError, provinces, getDescription]);

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

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return (
      t('common:error-number', { number: index + 1 }) +
      t(
        `application:step.personal-information.${schemaErrors[index]?.path
          ?.split('.')
          .map((el) => kebabCase(el))
          .join('.')}.${key}`
      )
    );
  };

  if (discoveryChannelsError || internetQualitiesError || languagesError || provincesError) {
    return <Error err={(discoveryChannelsError ?? internetQualitiesError ?? languagesError ?? provincesError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      {isDiscoveryChannelsLoading || isInternetQualitiesLoading || isLanguagesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step.personal-information.title')} - ${t('application:header')}`} />

          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
            {t('common:app.title')}
          </h1>
          <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('application:header')}</h2>

          {schemaErrors && schemaErrors.length > 0 && (
            <Alert title={t('common:error-form-cannot-be-submitted', { count: schemaErrors.length })} type={AlertType.danger}>
              <ul className="tw-list-disc">
                {schemaErrors.map(({ path }) => {
                  const [field] = path?.split('.') ?? [];

                  return path ? (
                    <li key={path} className="tw-my-2">
                      <a href={`#form-field-${camelCase(field)}`}>{getSchemaError(path)}</a>
                    </li>
                  ) : undefined;
                })}
              </ul>
            </Alert>
          )}

          <Wizard activeStep={1} numberOfSteps={4} previousHidden onNextClick={handleWizardOnNextClick}>
            <TextField
              field={nameof<PersonalInformationState>((o) => o.firstName)}
              label={t('application:step.personal-information.first-name.label')}
              value={formData.personalInformation.firstName}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.firstName))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
            />

            <TextField
              field={nameof<PersonalInformationState>((o) => o.lastName)}
              label={t('application:step.personal-information.last-name.label')}
              value={formData.personalInformation.lastName}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.lastName))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
            />

            <TextField
              field={nameof<PersonalInformationState>((o) => o.email)}
              label={t('application:step.personal-information.email.label')}
              value={formData.personalInformation.email}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.email))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <TextField
              field={nameof<PersonalInformationState>((o) => o.phoneNumber)}
              label={t('application:step.personal-information.phone-number.label')}
              helperText={t('application:step.personal-information.phone-number.helper-text')}
              value={formData.personalInformation.phoneNumber}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.phoneNumber))}
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <SelectField
              field={nameof<PersonalInformationState>((o) => o.birthYear)}
              label={t('application:step.personal-information.birth-year.label')}
              helperText={t('application:step.personal-information.birth-year.helper-text')}
              value={formData.personalInformation.birthYear?.toString()}
              onChange={handleOnOptionsFieldChange}
              options={yearOfBirthOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.birthYear))}
              required
              gutterBottom
            />

            <CheckboxeField
              field={nameof<PersonalInformationState>((o) => o.isProvinceMajorCertified)}
              label={t('application:step.personal-information.is-province-major-certified.label')}
              checked={formData.personalInformation.isProvinceMajorCertified}
              onChange={handleOnCheckboxFieldChange}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.isProvinceMajorCertified))}
              required
            />
            <div className="tw-mb-8 tw-pl-10">
              <a href="http://example.com" target="_blank" rel="noreferrer">
                {t('application:step.personal-information.is-province-major-certified.link')}
              </a>
            </div>

            <RadiosField
              field={nameof<PersonalInformationState>((o) => o.languageId)}
              label={t('application:step.personal-information.language-id.label')}
              value={formData.personalInformation.languageId}
              onChange={handleOnOptionsFieldChange}
              options={preferedLanguageOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.languageId))}
              required
              gutterBottom
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
            />

            <RadiosField
              field={nameof<PersonalInformationState>((o) => o.isCanadianCitizen)}
              label={t('application:step.personal-information.is-canadian-citizen.label')}
              value={formData.personalInformation.isCanadianCitizen?.toString()}
              onChange={handleOnOptionsFieldChange}
              options={yesNoOptions}
              helperText={t('application:step.personal-information.is-canadian-citizen.helper-text')}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.isCanadianCitizen))}
              required
              gutterBottom
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
            />

            <SelectField
              field={nameof<PersonalInformationState>((o) => o.provinceId)}
              label={t('application:step.personal-information.province-id.label')}
              value={formData.personalInformation.provinceId}
              onChange={handleOnOptionsFieldChange}
              options={provinceOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.provinceId))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12"
            />

            <SelectField
              field={nameof<PersonalInformationState>((o) => o.internetQualityId)}
              label={t('application:step.personal-information.internet-quality-id.label')}
              value={formData.personalInformation.internetQualityId}
              onChange={handleOnOptionsFieldChange}
              options={internetQualityOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.internetQualityId))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12"
            />

            <RadiosField
              field={nameof<PersonalInformationState>((o) => o.hasDedicatedDevice)}
              label={t('application:step.personal-information.has-dedicated-device.label')}
              value={formData.personalInformation.hasDedicatedDevice?.toString()}
              onChange={handleOnOptionsFieldChange}
              options={yesNoOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.hasDedicatedDevice))}
              required
              gutterBottom
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
            />

            <SelectField
              field={nameof<PersonalInformationState>((o) => o.discoveryChannelId)}
              label={t('application:step.personal-information.discovery-channel-id.label')}
              value={formData.personalInformation.discoveryChannelId}
              onChange={handleOnOptionsFieldChange}
              options={discoveryChannelOptions}
              error={getSchemaError(nameof<PersonalInformationState>((o) => o.discoveryChannelId))}
              required
              className="tw-w-full sm:tw-w-6/12"
            />
          </Wizard>
        </>
      )}
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default ApplicationPersonalInformationPage;
