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
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../components/form/SelectField';
import { SelectField } from '../../components/form/SelectField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent } from '../../components/Wizard';
import { useEducationLevels } from '../../hooks/api/code-lookups/useEducationLevels';
import { useGenders } from '../../hooks/api/code-lookups/useGenders';
import Error from '../_error';
import { Alert, AlertType } from '../../components/Alert';
import { ApplicationState, GetDescriptionFunc, Step2State, Constants } from './types';
import { step2Schema, step1Schema } from '../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../yup/types';
import { GetStaticProps } from 'next';
import { sleep } from '../../utils/misc-utils';
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../../components/form/RadiosField';
import { useDemographics } from '../../hooks/api/code-lookups/useDemographics';
import { theme } from '../../config';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';
import Trans from 'next-translate/Trans';

const Step2Page = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { data: demographics, isLoading: isDemographicsLoading, error: demographicsError } = useDemographics({ lang });
  const { data: educationLevels, isLoading: isEducationLevelsLoading, error: educationLevelsError } = useEducationLevels({ lang });
  const { data: genders, isLoading: isGendersLoading, error: gendersError } = useGenders({ lang });

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const [formData, setFormDataState] = useState<ApplicationState>(() => {
    const defaultState: ApplicationState = { step1: {}, step2: {}, step3: {}, step4: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  const [previousStepsValidationCompleted, setPreviousStepsValidationCompleted] = useState<boolean>(false);

  const validatePreviousSteps = useCallback(
    async (formData: ApplicationState): Promise<void> => {
      await sleep(500);
      if ((await step1Schema.isValid(formData.step1)) === false) {
        router.replace('/application/step-1');
      } else {
        setPreviousStepsValidationCompleted(true);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!previousStepsValidationCompleted) validatePreviousSteps(formData);
  }, [validatePreviousSteps, previousStepsValidationCompleted, formData]);

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, step2: { ...prev.step2, [field]: value ?? undefined } }));
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
    router.push('/application/step-1');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await step2Schema.validate(formData.step2, { abortEarly: false });
      window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
      router.push('/application/step-3');
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      document.getElementById('validation-error')?.focus();
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // demographic radio options
  const demographicOptions = useMemo<RadiosFieldOption[]>(() => {
    if (isDemographicsLoading || demographicsError) return [];
    return demographics?._embedded.demographics.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isDemographicsLoading, demographicsError, demographics, getDescription]);

  // education level options
  const educationLevelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isEducationLevelsLoading || educationLevelsError) return [];
    return educationLevels?._embedded.educationLevels.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isEducationLevelsLoading, educationLevelsError, educationLevels, getDescription]);

  // gender options
  const genderOptions = useMemo<SelectFieldOption[]>(() => {
    if (isGendersLoading || gendersError) return [];
    return genders?._embedded.genders.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isGendersLoading, gendersError, genders, getDescription]);

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return t('common:error-number', { number: index + 1 }) + t(`application:field.${schemaErrors[index]?.path}.${key}`);
  };

  if (demographicsError || educationLevelsError || gendersError) {
    return <Error err={(demographicsError ?? educationLevelsError ?? gendersError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout>
      {!previousStepsValidationCompleted || isDemographicsLoading || isEducationLevelsLoading || isGendersLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-2.title')} - ${t('application:header')}`} />

          <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('application:header')}</h2>

          {schemaErrors && schemaErrors.length > 0 && (
            <Alert id="validation-error" title={t('common:error-form-cannot-be-submitted', { count: schemaErrors.length })} type={AlertType.danger}>
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

          <Wizard activeStep={2} numberOfSteps={4} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick}>
            <p className="tw-m-0 tw-mb-10 tw-font-bold">{t('application:step-2.information-note')}</p>

            <SelectField
              field={nameof<Step2State>((o) => o.genderId)}
              label={t('application:field.genderId.label')}
              value={formData.step2.genderId}
              onChange={handleOnOptionsFieldChange}
              options={genderOptions}
              error={getSchemaError(nameof<Step2State>((o) => o.genderId))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12"
            />

            <SelectField
              field={nameof<Step2State>((o) => o.educationLevelId)}
              label={t('application:field.educationLevelId.label')}
              helperText={t('application:field.educationLevelId.helper-text')}
              value={formData.step2.educationLevelId}
              onChange={handleOnOptionsFieldChange}
              options={educationLevelOptions}
              error={getSchemaError(nameof<Step2State>((o) => o.educationLevelId))}
              required
              gutterBottom
              className="tw-w-full"
            />

            <RadiosField
              field={nameof<Step2State>((o) => o.demographicId)}
              label={t('application:field.demographicId.label')}
              value={formData.step2.demographicId}
              onChange={handleOnOptionsFieldChange}
              options={demographicOptions}
              error={getSchemaError(nameof<Step2State>((o) => o.demographicId))}
              required
              inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}>
              <ul className="tw-list-disc tw-list-inside tw-my-4 tw-font-bold">
                {[
                  t('application:field.demographicId.children-items.item-1'),
                  t('application:field.demographicId.children-items.item-2'),
                  t('application:field.demographicId.children-items.item-3'),
                  t('application:field.demographicId.children-items.item-4'),
                  t('application:field.demographicId.children-items.item-5'),
                  t('application:field.demographicId.children-items.item-6'),
                  t('application:field.demographicId.children-items.item-7'),
                ].map((val) => (
                  <li key={val} className="tw-mb-2">
                    {val}
                  </li>
                ))}
              </ul>
              <span className="help-block">
                <Trans
                  i18nKey="application:field.demographicId.helper-text"
                  components={{
                    link: (
                      <a key="link" href={t('application:field.demographicId.helper-text-url')} target="_blank" rel="noreferrer">
                        link
                      </a>
                    ),
                  }}
                />
              </span>
            </RadiosField>
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

export default Step2Page;
