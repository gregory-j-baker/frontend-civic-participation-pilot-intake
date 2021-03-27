/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import type { CheckboxeFieldOnChangeEvent } from '../../../components/form/CheckboxeField';
import { CheckboxeField } from '../../../components/form/CheckboxeField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnPreviousClickEvent, WizardOnNextClickEvent } from '../../../components/Wizard';
import { useSubmitApplication } from '../../../hooks/api/applications/useSubmitApplication';
import Error from '../../_error';
import { Alert, AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, Step4State, Constants, GetDescriptionFunc, Step1State, Step2State, Step3State } from '../types';
import { step4Schema, step3Schema, applicationSchema, step2Schema, step1Schema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { FormDefinitionListItem } from '../../../components/FormDefinitionListItem';
import { useDemographic } from '../../../hooks/api/code-lookups/useDemographic';
import { useDiscoveryChannel } from '../../../hooks/api/code-lookups/useDiscoveryChannel';
import { useEducationLevel } from '../../../hooks/api/code-lookups/useEducationLevel';
import { useGender } from '../../../hooks/api/code-lookups/useGender';
import { useLanguage } from '../../../hooks/api/code-lookups/useLanguage';
import { useProvince } from '../../../hooks/api/code-lookups/useProvince';
import { ApplicationSubmitData } from '../../../hooks/api/applications/types';
import { sleep } from '../../../utils/misc-utils';

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
      window.location.hash = 'wb-cont';
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
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-4.title')} - ${t('application:header')}`} />

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

          <Wizard
            activeStep={4}
            numberOfSteps={4}
            header={t('application:step-4.header')}
            nextText={t('application:submit')}
            onPreviousClick={handleWizardOnPreviousClick}
            onNextClick={handleWizardOnNextClick}
            disabled={submitApplicationIsLoading || submitApplicationIsSuccess}>
            <div className="tw-mb-10">
              <FormReview {...formData} />
            </div>
            <div className="tw-border-l-4 tw-rounded tw-px-4 tw-py-2 tw-shadow tw-flex tw-space-x-3 tw-items-center tw-bg-blue-50 tw-border-blue-600 tw-mb-10 ">
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
            <CheckboxeField
              field={nameof<Step4State>((o) => o.isInformationConsented)}
              label={t('application:field.isInformationConsented.label')}
              checked={formData.step4.isInformationConsented}
              onChange={handleOnCheckboxFieldChange}
              disabled={submitApplicationIsLoading || submitApplicationIsSuccess}
              error={getSchemaError(nameof<Step4State>((o) => o.isInformationConsented))}
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

export interface FormReviewItem {
  children?: React.ReactNode;
  key: string;
  text: string;
  value: string;
}

export interface FormReviewProps {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
}

export const FormReview = ({ step1, step2, step3 }: FormReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: demographic, isLoading: demographicIsLoading } = useDemographic(step2.demographicId as string);
  const { data: discoveryChannel, isLoading: discoveryChannelIsLoading } = useDiscoveryChannel(step1.discoveryChannelId as string);
  const { data: educationLevel, isLoading: educationLevelIsLoading } = useEducationLevel(step2.educationLevelId as string);
  const { data: gender, isLoading: genderIsLoading } = useGender(step2.genderId as string);
  const { data: language, isLoading: languageIsLoading } = useLanguage(step1.languageId as string);
  const { data: province, isLoading: provinceIsLoading } = useProvince(step1.provinceId as string);

  const getDescription: GetDescriptionFunc = useCallback((obj) => (obj ? (lang === 'fr' ? obj.descriptionFr : obj.descriptionEn) : ''), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    // firstName
    if (step1.firstName) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.firstName),
        text: t(`application:field.${nameof<Step1State>((o) => o.firstName)}.label`),
        value: step1.firstName,
      });
    }

    // lastName
    if (step1.lastName) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.lastName),
        text: t(`application:field.${nameof<Step1State>((o) => o.lastName)}.label`),
        value: step1.lastName,
      });
    }

    // email
    if (step1.email) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.email),
        text: t(`application:field.${nameof<Step1State>((o) => o.email)}.label`),
        value: step1.email,
      });
    }

    // phone
    if (step1.phoneNumber) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.phoneNumber),
        text: t(`application:field.${nameof<Step1State>((o) => o.phoneNumber)}.label`),
        value: step1.phoneNumber,
      });
    }

    // birthYear
    if (step1.birthYear) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.birthYear),
        text: t(`application:field.${nameof<Step1State>((o) => o.birthYear)}.label`),
        value: step1.birthYear.toString(),
      });
    }

    // languageId
    if (!languageIsLoading && language) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.languageId),
        text: t(`application:field.${nameof<Step1State>((o) => o.languageId)}.label`),
        value: getDescription(language),
      });
    }

    // isCanadianCitizen
    if (step1.isCanadianCitizen !== undefined) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.isCanadianCitizen),
        text: t(`application:field.${nameof<Step1State>((o) => o.isCanadianCitizen)}.label`),
        value: step1.isCanadianCitizen ? t('common:yes') : t('common:no'),
      });
    }

    // provindId
    if (!provinceIsLoading && province) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.provinceId),
        text: t(`application:field.${nameof<Step1State>((o) => o.provinceId)}.label`),
        value: getDescription(province),
      });
    }

    // discoveryChannelId
    if (!discoveryChannelIsLoading && discoveryChannel) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step1.discoveryChannelId),
        text: t(`application:field.${nameof<Step1State>((o) => o.discoveryChannelId)}.label`),
        value: getDescription(discoveryChannel),
      });
    }

    // genderId
    if (!genderIsLoading && gender) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step2.genderId),
        text: t(`application:field.${nameof<Step2State>((o) => o.genderId)}.label`),
        value: getDescription(gender),
      });
    }

    // educationLevelId
    if (!educationLevelIsLoading && educationLevel) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step2.educationLevelId),
        text: t(`application:field.${nameof<Step2State>((o) => o.educationLevelId)}.label`),
        value: getDescription(educationLevel),
      });
    }

    // demographicId
    if (!demographicIsLoading && demographic) {
      items.push({
        children: (
          <ul className="tw-list-disc tw-list-inside tw-my-4">
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
        ),
        key: nameof<ApplicationState>((o) => o.step2.demographicId),
        text: t(`application:field.${nameof<Step2State>((o) => o.demographicId)}.label`),
        value: getDescription(demographic),
      });
    }

    // skillsInterest
    if (step3.skillsInterest) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step3.skillsInterest),
        text: t(`application:field.${nameof<Step3State>((o) => o.skillsInterest)}.label`),
        value: step3.skillsInterest,
      });
    }

    // communityInterest
    if (step3.communityInterest) {
      items.push({
        key: nameof<ApplicationState>((o) => o.step3.communityInterest),
        text: t(`application:field.${nameof<Step3State>((o) => o.communityInterest)}.label`),
        value: step3.communityInterest,
      });
    }

    return items;
  }, [step1, step3, t, getDescription, demographic, demographicIsLoading, discoveryChannel, discoveryChannelIsLoading, educationLevel, educationLevelIsLoading, gender, genderIsLoading, language, languageIsLoading, province, provinceIsLoading]);

  return (
    <dl>
      {formReviewItems.map(({ children, key, text, value }, index) => (
        <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value}>
          {children}
        </FormDefinitionListItem>
      ))}
    </dl>
  );
};

export default Step4Page;
