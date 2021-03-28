/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo, useState, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { CheckboxeFieldOnChangeEvent } from '../../components/form/CheckboxeField';
import { CheckboxeField } from '../../components/form/CheckboxeField';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../../components/form/RadiosField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../components/form/SelectField';
import { SelectField } from '../../components/form/SelectField';
import type { TextAreaFieldOnChangeEvent } from '../../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../../components/form/TextField';
import { TextField } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent } from '../../components/Wizard';
import { theme } from '../../config';
import { useDiscoveryChannels } from '../../hooks/api/code-lookups/useDiscoveryChannels';
import { useLanguages } from '../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../hooks/api/code-lookups/useProvinces';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';
import { getYears } from '../../utils/misc-utils';
import Error from '../_error';
import { Alert, AlertType } from '../../components/Alert';
import { ApplicationState, GetDescriptionFunc, Step1State, Constants } from './types';
import { step1Schema } from '../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { tryFormatPhoneNumber } from '../../utils/phone-utils';

const Step1Page = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { data: discoveryChannels, isLoading: isDiscoveryChannelsLoading, error: discoveryChannelsError } = useDiscoveryChannels({ lang });
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages({ lang });
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces({ lang });

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const [formData, setFormDataState] = useState<ApplicationState>(() => {
    const defaultState: ApplicationState = { step1: {}, step2: {}, step3: {}, step4: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      let newValue: boolean | string | number | null | undefined = undefined;

      if (value) {
        if (value === true.toString()) newValue = true;
        else if (value === false.toString()) newValue = false;
        else if (!isNaN(Number(value))) newValue = Number(value);
        else newValue = value;
      }

      return { ...prev, step1: { ...prev.step1, [field]: newValue } };
    });
  };

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, step1: { ...prev.step1, [field]: value ?? undefined } }));
  };

  const handleOnPhonNumberFieldChange: TextFieldOnChangeEvent = ({ value }) => {
    setFormDataState((prev) => ({ ...prev, step1: { ...prev.step1, phoneNumber: tryFormatPhoneNumber(value ?? undefined) } }));
  };

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => ({ ...prev, step1: { ...prev.step1, [field]: checked } }));
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await step1Schema.validate(formData.step1, { abortEarly: false });
      window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
      router.push('/application/step-2');
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      window.location.hash = 'wb-cont';
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // year of birth options
  const yearOfBirthOptions = useMemo<SelectFieldOption[]>(() => getYears({ startYear: 1990, endYear: 2003 }).map((year) => ({ value: year.toString(), text: year.toString() })), []);

  // language options
  const languageOptions = useMemo<RadiosFieldOption[]>(() => {
    if (isLanguagesLoading || languagesError) return [];
    return languages?._embedded.languages.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isLanguagesLoading, languagesError, languages, getDescription]);

  // province options
  const provinceOptions = useMemo<SelectFieldOption[]>(() => {
    if (isProvincesLoading || provincesError) return [];
    return provinces?._embedded.provinces.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isProvincesLoading, provincesError, provinces, getDescription]);

  // discovery channel options
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

    return t('common:error-number', { number: index + 1 }) + t(`application:field.${schemaErrors[index]?.path}.${key}`);
  };

  if (discoveryChannelsError || languagesError || provincesError) {
    return <Error err={(discoveryChannelsError ?? languagesError ?? provincesError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout>
      {isDiscoveryChannelsLoading || isLanguagesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-1.title')} - ${t('application:header')}`} />

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
                      <a href={`#form-field-${field}`}>{getSchemaError(path)}</a>
                    </li>
                  ) : undefined;
                })}
              </ul>
            </Alert>
          )}

          <Wizard activeStep={1} numberOfSteps={4} previousHidden onNextClick={handleWizardOnNextClick}>
            <TextField
              field={nameof<Step1State>((o) => o.firstName)}
              label={t('application:field.firstName.label')}
              value={formData.step1.firstName}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<Step1State>((o) => o.firstName))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
            />

            <TextField
              field={nameof<Step1State>((o) => o.lastName)}
              label={t('application:field.lastName.label')}
              value={formData.step1.lastName}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<Step1State>((o) => o.lastName))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12 md:tw-w-4/12"
            />

            <TextField
              type="email"
              field={nameof<Step1State>((o) => o.email)}
              label={t('application:field.email.label')}
              value={formData.step1.email}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<Step1State>((o) => o.email))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <TextField
              type="tel"
              field={nameof<Step1State>((o) => o.phoneNumber)}
              label={t('application:field.phoneNumber.label')}
              helperText={t('application:field.phoneNumber.helper-text')}
              value={formData.step1.phoneNumber}
              onChange={handleOnPhonNumberFieldChange}
              error={getSchemaError(nameof<Step1State>((o) => o.phoneNumber))}
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <SelectField
              field={nameof<Step1State>((o) => o.birthYear)}
              label={t('application:field.birthYear.label')}
              helperText={t('application:field.birthYear.helper-text')}
              value={formData.step1.birthYear?.toString()}
              onChange={handleOnOptionsFieldChange}
              options={yearOfBirthOptions}
              error={getSchemaError(nameof<Step1State>((o) => o.birthYear))}
              required
              gutterBottom
            />

            <CheckboxeField
              field={nameof<Step1State>((o) => o.isProvinceMajorCertified)}
              label={t('application:field.isProvinceMajorCertified.label')}
              checked={formData.step1.isProvinceMajorCertified}
              onChange={handleOnCheckboxFieldChange}
              error={getSchemaError(nameof<Step1State>((o) => o.isProvinceMajorCertified))}
              gutterBottom
              required>
              <div className="tw-pl-10">
                <a href="http://example.com" target="_blank" rel="noreferrer">
                  {t('application:field.isProvinceMajorCertified.link')}
                </a>
              </div>
            </CheckboxeField>

            <RadiosField
              field={nameof<Step1State>((o) => o.languageId)}
              label={t('application:field.languageId.label')}
              value={formData.step1.languageId}
              onChange={handleOnOptionsFieldChange}
              options={languageOptions}
              error={getSchemaError(nameof<Step1State>((o) => o.languageId))}
              required
              gutterBottom
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
            />

            <RadiosField
              field={nameof<Step1State>((o) => o.isCanadianCitizen)}
              label={t('application:field.isCanadianCitizen.label')}
              value={formData.step1.isCanadianCitizen?.toString()}
              onChange={handleOnOptionsFieldChange}
              options={yesNoOptions}
              helperText={t('application:field.isCanadianCitizen.helper-text')}
              error={getSchemaError(nameof<Step1State>((o) => o.isCanadianCitizen))}
              required
              gutterBottom
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
            />

            <SelectField
              field={nameof<Step1State>((o) => o.provinceId)}
              label={t('application:field.provinceId.label')}
              value={formData.step1.provinceId}
              onChange={handleOnOptionsFieldChange}
              options={provinceOptions}
              error={getSchemaError(nameof<Step1State>((o) => o.provinceId))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12"
            />

            <SelectField
              field={nameof<Step1State>((o) => o.discoveryChannelId)}
              label={t('application:field.discoveryChannelId.label')}
              value={formData.step1.discoveryChannelId}
              onChange={handleOnOptionsFieldChange}
              options={discoveryChannelOptions}
              error={getSchemaError(nameof<Step1State>((o) => o.discoveryChannelId))}
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

export default Step1Page;
