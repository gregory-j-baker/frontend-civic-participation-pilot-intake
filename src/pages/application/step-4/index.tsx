/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { CheckboxeFieldOnChangeEvent } from '../../../components/form/CheckboxeField';
import { CheckboxeField } from '../../../components/form/CheckboxeField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnPreviousClickEvent, WizardOnNextClickEvent } from '../../../components/Wizard';
import { useSubmitApplication } from '../../../hooks/api/applications/useSubmitApplication';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import { Alert, AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, Step4State, Constants, GetDescriptionFunc } from '../types';
import { step4Schema, step3Schema, applicationSchema, step2Schema, step1Schema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { FormDefinitionListItem } from '../../../components/FormDefinitionListItem';
import { useDiscoveryChannels } from '../../../hooks/api/code-lookups/useDiscoveryChannels';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { useEducationLevels } from '../../../hooks/api/code-lookups/useEducationLevels';
import { useGenders } from '../../../hooks/api/code-lookups/useGenders';
import { sleep } from '../../../utils/misc-utils';
import Link from 'next/link';
import { ApplicationSubmitData } from '../../../hooks/api/applications/types';

const Step4Page = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: submitApplication, error: submitApplicationError, isLoading: submitApplicationIsLoading, isSuccess: submitApplicationIsSuccess } = useSubmitApplication({
    onSuccess: () => {
      window.sessionStorage.removeItem(Constants.FormDataStorageKey);
      router.push('/application/confirmation');
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

  useEffect(() => {
    window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
  }, [formData]);

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => {
      const newObj = { ...prev.step4, [field]: checked };
      return { ...prev, step4: newObj };
    });
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
        const applicationData: ApplicationSubmitData = {
          birthYear: formData.step1.birthYear as number,
          communityInterest: formData.step3.communityInterest as string,
          discoveryChannelId: formData.step1.discoveryChannelId as string,
          educationLevelId: formData.step2.educationLevelId as string,
          email: formData.step1.email as string,
          firstName: formData.step1.firstName as string,
          genderId: formData.step2.genderId as string,
          isCanadianCitizen: formData.step1.isCanadianCitizen as boolean,
          languageId: formData.step1.languageId as string,
          lastName: formData.step1.languageId as string,
          phoneNumber: formData.step1.phoneNumber,
          provinceId: formData.step1.provinceId as string,
          skillsInterest: formData.step3.skillsInterest as string,
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

    return (
      t('common:error-number', { number: index + 1 }) +
      t(
        `application:field.${schemaErrors[index]?.path
          ?.split('.')
          .map((el) => kebabCase(el))
          .join('.')}.${key}`
      )
    );
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
                      <a href={`#form-field-${camelCase(field)}`}>{getSchemaError(path)}</a>
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
              <FormReview applicationState={formData} />
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
              label={t('application:field.is-information-consented.label')}
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
  key: string;
  text: string;
  value: string;
}

export interface FormReviewProps {
  applicationState: ApplicationState;
}

export const FormReview = ({ applicationState }: FormReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: discoveryChannels } = useDiscoveryChannels({ lang });
  const { data: educationLevels } = useEducationLevels({ lang });
  const { data: genders } = useGenders({ lang });
  const { data: languages } = useLanguages({ lang });
  const { data: provinces } = useProvinces({ lang });

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    if (Object.keys(applicationState.step1).length !== 0) {
      // firstName
      if (applicationState.step1.firstName) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.firstName),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.firstName)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.firstName,
        });
      }

      // lastName
      if (applicationState.step1.lastName) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.lastName),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.lastName)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.lastName,
        });
      }

      // email
      if (applicationState.step1.email) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.email),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.email)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.email,
        });
      }

      // phone
      if (applicationState.step1.phoneNumber) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.phoneNumber),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.phoneNumber)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.phoneNumber,
        });
      }

      // birthYear
      if (applicationState.step1.birthYear) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.birthYear),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.birthYear)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.birthYear.toString(),
        });
      }

      // languageId
      if (applicationState.step1.languageId) {
        const language = languages?._embedded.languages.find((o) => o.id === applicationState.step1.languageId);
        if (language) {
          items.push({
            key: nameof<ApplicationState>((o) => o.step1.languageId),
            text: t(
              `application:field.${nameof<ApplicationState>((o) => o.step1.languageId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(language),
          });
        }
      }

      // isCanadianCitizen
      if (applicationState.step1.isCanadianCitizen !== undefined) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step1.isCanadianCitizen),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step1.isCanadianCitizen)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step1.isCanadianCitizen ? t('common:yes') : t('common:no'),
        });
      }

      // provindId
      if (applicationState.step1.provinceId) {
        const province = provinces?._embedded.provinces.find((o) => o.id === applicationState.step1.provinceId);
        if (province) {
          items.push({
            key: nameof<ApplicationState>((o) => o.step1.provinceId),
            text: t(
              `application:field.${nameof<ApplicationState>((o) => o.step1.provinceId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(province),
          });
        }
      }

      // discoveryChannelId
      if (applicationState.step1.discoveryChannelId) {
        const discoveryChannel = discoveryChannels?._embedded.discoveryChannels.find((o) => o.id === applicationState.step1.discoveryChannelId);
        if (discoveryChannel) {
          items.push({
            key: nameof<ApplicationState>((o) => o.step1.discoveryChannelId),
            text: t(
              `application:field.${nameof<ApplicationState>((o) => o.step1.discoveryChannelId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(discoveryChannel),
          });
        }
      }
    }

    if (Object.keys(applicationState.step2).length !== 0) {
      // genderId
      if (applicationState.step2.genderId) {
        const gender = genders?._embedded.genders.find((o) => o.id === applicationState.step2.genderId);
        if (gender) {
          items.push({
            key: nameof<ApplicationState>((o) => o.step2.genderId),
            text: t(
              `application:field.${nameof<ApplicationState>((o) => o.step2.genderId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(gender),
          });
        }
      }

      // educationLevelId
      if (applicationState.step2.educationLevelId) {
        const educationLevel = educationLevels?._embedded.educationLevels.find((o) => o.id === applicationState.step2.educationLevelId);

        if (educationLevel) {
          items.push({
            key: nameof<ApplicationState>((o) => o.step2.educationLevelId),
            text: t(
              `application:field.${nameof<ApplicationState>((o) => o.step2.educationLevelId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(educationLevel),
          });
        }
      }
    }

    if (Object.keys(applicationState.step3).length !== 0) {
      // skillsInterest
      if (applicationState.step3.skillsInterest) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step3.skillsInterest),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step3.skillsInterest)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step3.skillsInterest,
        });
      }

      // communityInterest
      if (applicationState.step3.communityInterest) {
        items.push({
          key: nameof<ApplicationState>((o) => o.step3.communityInterest),
          text: t(
            `application:field.${nameof<ApplicationState>((o) => o.step3.communityInterest)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.step3.communityInterest,
        });
      }
    }

    return items;
  }, [applicationState, t, getDescription, discoveryChannels, educationLevels, genders, languages, provinces]);

  return (
    <dl>
      {formReviewItems.map(({ key, text, value }, index) => (
        <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value} />
      ))}
    </dl>
  );
};

export default Step4Page;
