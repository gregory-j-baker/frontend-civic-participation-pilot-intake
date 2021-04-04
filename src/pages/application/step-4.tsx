/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import type { CheckboxeFieldOnChangeEvent } from '../../components/form/CheckboxeField';
import { CheckboxeField } from '../../components/form/CheckboxeField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { Wizard, WizardOnPreviousClickEvent, WizardOnNextClickEvent } from '../../components/Wizard';
import { useSubmitApplication } from '../../hooks/api/applications/useSubmitApplication';
import Error from '../_error';
import { Alert, AlertType } from '../../components/Alert';
import { ApplicationState, Step4State, Constants, Step1State, Step2State, Step3State } from './types';
import { step4Schema, step3Schema, applicationSchema, step2Schema, step1Schema } from '../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../yup/types';
import { GetStaticProps } from 'next';
import { ApplicationSubmitData } from '../../hooks/api/applications/types';
import { sleep } from '../../utils/misc-utils';
import { ApplicationReview } from '../../components/pages/ApplicationReview';

const Step4Page = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: submitApplication, error: submitApplicationError, isLoading: submitApplicationIsLoading, isSuccess: submitApplicationIsSuccess } = useSubmitApplication({
    onSuccess: () => {
      window.sessionStorage.removeItem(Constants.FormDataStorageKey);
      sessionStorage.setItem(Constants.EmailVerificationStorageKey, formData.step1.email as string);
      router.push('/application/email-verification');
    },
  });

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
      } else if ((await step2Schema.isValid(formData.step2)) === false) {
        router.replace('/application/step-2');
      } else if ((await step3Schema.isValid(formData.step3)) === false) {
        router.replace('/application/step-3');
      } else {
        setPreviousStepsValidationCompleted(true);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!previousStepsValidationCompleted) validatePreviousSteps(formData);
  }, [validatePreviousSteps, previousStepsValidationCompleted, formData]);

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => ({ ...prev, step4: { ...prev.step4, [field]: checked } }));
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    router.push('/application/step-3');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    // validate step4 schema
    try {
      await step4Schema.validate(formData.step4, { abortEarly: false });

      if (await applicationSchema.isValid(formData)) {
        // submit appplication
        const step1State = formData.step1 as Step1State;
        const step2State = formData.step2 as Step2State;
        const step3State = formData.step3 as Step3State;

        const applicationData: ApplicationSubmitData = {
          birthYear: step1State.birthYear as number,
          communityInterest: step3State.communityInterest as string,
          demographicId: step2State.demographicId as string,
          discoveryChannelId: step1State.discoveryChannelId as string,
          educationLevelId: step2State.educationLevelId as string,
          email: step1State.email as string,
          firstName: step1State.firstName as string,
          genderId: step2State.genderId as string,
          isCanadianCitizen: step1State.isCanadianCitizen as boolean,
          languageId: step1State.languageId as string,
          lastName: step1State.lastName as string,
          phoneNumber: step1State.phoneNumber,
          provinceId: step1State.provinceId as string,
          skillsInterest: step3State.skillsInterest as string,
        };

        submitApplication(applicationData);
      }
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      document.getElementById('validation-error')?.focus();
    }
  };

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return t('common:error-number', { number: index + 1 }) + t(`application:field.${schemaErrors[index]?.path}.${key}`);
  };

  if (submitApplicationError) return <Error err={submitApplicationError as HttpClientResponseError} />;

  return (
    <MainLayout>
      {!previousStepsValidationCompleted ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-4.title')} - ${t('application:header')}`} />

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

          <Wizard
            activeStep={4}
            numberOfSteps={4}
            header={t('application:step-4.header')}
            nextText={t('application:submit')}
            onPreviousClick={handleWizardOnPreviousClick}
            onNextClick={handleWizardOnNextClick}
            disabled={submitApplicationIsLoading || submitApplicationIsSuccess}>
            <div className="tw-mb-10">
              <ApplicationReview
                application={{
                  birthYear: formData.step1.birthYear as number,
                  communityInterest: formData.step3.communityInterest as string,
                  demographicId: formData.step2.demographicId as string,
                  discoveryChannelId: formData.step1.discoveryChannelId as string,
                  educationLevelId: formData.step2.educationLevelId as string,
                  email: formData.step1.email as string,
                  firstName: formData.step1.firstName as string,
                  genderId: formData.step2.genderId as string,
                  isCanadianCitizen: formData.step1.isCanadianCitizen as boolean,
                  languageId: formData.step1.languageId as string,
                  lastName: formData.step1.lastName as string,
                  phoneNumber: formData.step1.phoneNumber,
                  provinceId: formData.step1.provinceId as string,
                  skillsInterest: formData.step3.skillsInterest as string,
                }}
              />
            </div>
            <CheckboxeField
              field={nameof<Step4State>((o) => o.isInformationConsented)}
              label={t('application:field.isInformationConsented.label')}
              checked={formData.step4.isInformationConsented}
              onChange={handleOnCheckboxFieldChange}
              disabled={submitApplicationIsLoading || submitApplicationIsSuccess}
              error={getSchemaError(nameof<Step4State>((o) => o.isInformationConsented))}
            />
            <div className="tw-border-l-4 tw-rounded tw-px-4 tw-py-2 tw-shadow tw-flex tw-space-x-3 tw-items-center tw-bg-blue-50 tw-border-blue-600 tw-mt-10 ">
              <div className="tw-w-5 tw-h-5 tw-text-blue-600 tw-inline-block tw-flex-shrink-0">
                <svg className="tw-fill-current tw-w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                {t('application:step-4.privacy-notice-statement.label') + ' '}
                <Link href="/privacy-notice-statement">
                  <a>{t('application:step-4.privacy-notice-statement.link')}</a>
                </Link>
              </div>
            </div>
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

export default Step4Page;
