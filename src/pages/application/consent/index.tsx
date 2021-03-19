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
import { ApplicationState, ConsentState, Constants, GetDescriptionFunc } from '../types';
import { consentSchema, expressionOfInterestSchema, applicationSchema, identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { FormDefinitionListItem } from '../../../components/FormDefinitionListItem';
import { useDiscoveryChannels } from '../../../hooks/api/code-lookups/useDiscoveryChannels';
import { useInternetQualities } from '../../../hooks/api/code-lookups/useInternetQualities';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { useEducationLevels } from '../../../hooks/api/code-lookups/useEducationLevels';
import { useGenders } from '../../../hooks/api/code-lookups/useGenders';
import { useIndigenousTypes } from '../../../hooks/api/code-lookups/useIndigenousTypes';
import { sleep } from '../../../utils/misc-utils';
import Link from 'next/link';
import { ApplicationSubmitData } from '../../../hooks/api/applications/types';
import { useDisabilities } from '../../../hooks/api/code-lookups/useDisabilities';
import { useNewcomers } from '../../../hooks/api/code-lookups/useNewcomers';
import { useSexualOrientations } from '../../../hooks/api/code-lookups/useSexualOrientations';
import { useMinorities } from '../../../hooks/api/code-lookups/useMinorities';
import { useRurals } from '../../../hooks/api/code-lookups/useRurals';

const ConsentPage = (): JSX.Element => {
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
    const defaultState: ApplicationState = { personalInformation: {}, identityInformation: {}, expressionOfInterest: {}, consent: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  const [previousStepsValidationCompleted, setPreviousStepsValidationCompleted] = useState<boolean>(false);

  const validatePreviousSteps = useCallback(
    async (formData: ApplicationState): Promise<void> => {
      await sleep(500);
      if ((await personalInformationSchema.isValid(formData.personalInformation)) === false) {
        router.replace('/application/personal-information');
      } else if ((await identityInformationSchema.isValid(formData.identityInformation)) === false) {
        router.replace('/application/identity-information');
      } else if ((await expressionOfInterestSchema.isValid(formData.expressionOfInterest)) === false) {
        router.replace('/application/expression-of-interest');
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
      const newObj = { ...prev.consent, [field]: checked };
      return { ...prev, consent: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    router.push('/application/expression-of-interest');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    // validate consent schema
    try {
      await consentSchema.validate(formData.consent, { abortEarly: false });

      if (await applicationSchema.isValid(formData)) {
        // submit appplication
        const applicationData: ApplicationSubmitData = {
          birthYear: formData.personalInformation.birthYear as number,
          communityInterest: formData.expressionOfInterest.communityInterest as string,
          disabilityId: formData.identityInformation.disabilityId as string,
          discoveryChannelId: formData.personalInformation.discoveryChannelId as string,
          educationLevelId: formData.identityInformation.educationLevelId as string,
          email: formData.personalInformation.email as string,
          firstName: formData.personalInformation.firstName as string,
          genderId: formData.identityInformation.genderId as string,
          hasDedicatedDevice: formData.personalInformation.hasDedicatedDevice as boolean,
          indigenousTypeId: formData.identityInformation.indigenousTypeId as string,
          internetQualityId: formData.personalInformation.internetQualityId as string,
          isCanadianCitizen: formData.personalInformation.isCanadianCitizen as boolean,
          languageId: formData.personalInformation.languageId as string,
          lastName: formData.personalInformation.languageId as string,
          minorityId: formData.identityInformation.minorityId as string,
          newcomerId: formData.identityInformation.newcomerId as string,
          phoneNumber: formData.personalInformation.phoneNumber,
          programInterest: formData.expressionOfInterest.programInterest,
          provinceId: formData.personalInformation.provinceId as string,
          ruralId: formData.identityInformation.ruralId as string,
          sexualOrientationId: formData.identityInformation.sexualOrientationId as string,
          skillsInterest: formData.expressionOfInterest.skillsInterest as string,
        };

        submitApplication(applicationData);
      }
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push('/application/consent#wb-cont', undefined, { shallow: true });
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
        `application:step.consent.${schemaErrors[index]?.path
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
          <NextSeo title={`${t('application:step.consent.title')} - ${t('application:header')}`} />

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
            header={t('application:step.consent.header')}
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
                {t('application:step.consent.privacy-notice-statement.label') + ' '}
                <Link href="/privacy-notice-statement">
                  <a>{t('application:step.consent.privacy-notice-statement.link')}</a>
                </Link>
              </div>
            </div>
            <CheckboxeField
              field={nameof<ConsentState>((o) => o.isInformationConsented)}
              label={t('application:step.consent.is-information-consented.label')}
              checked={formData.consent.isInformationConsented}
              onChange={handleOnCheckboxFieldChange}
              disabled={submitApplicationIsLoading || submitApplicationIsSuccess}
              error={getSchemaError(nameof<ConsentState>((o) => o.isInformationConsented))}
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

  const { data: disabilities } = useDisabilities({ lang });
  const { data: discoveryChannels } = useDiscoveryChannels({ lang });
  const { data: educationLevels } = useEducationLevels({ lang });
  const { data: genders } = useGenders({ lang });
  const { data: indigenousTypes } = useIndigenousTypes({ lang });
  const { data: internetQualities } = useInternetQualities({ lang });
  const { data: languages } = useLanguages({ lang });
  const { data: minorities } = useMinorities({ lang });
  const { data: newcomers } = useNewcomers({ lang });
  const { data: provinces } = useProvinces({ lang });
  const { data: rurals } = useRurals({ lang });
  const { data: sexualOrientations } = useSexualOrientations({ lang });

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    if (Object.keys(applicationState.personalInformation).length !== 0) {
      // firstName
      if (applicationState.personalInformation.firstName) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.firstName),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.firstName)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.firstName,
        });
      }

      // lastName
      if (applicationState.personalInformation.lastName) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.lastName),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.lastName)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.lastName,
        });
      }

      // email
      if (applicationState.personalInformation.email) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.email),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.email)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.email,
        });
      }

      // phone
      if (applicationState.personalInformation.phoneNumber) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.phoneNumber),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.phoneNumber)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.phoneNumber,
        });
      }

      // birthYear
      if (applicationState.personalInformation.birthYear) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.birthYear),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.birthYear)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.birthYear.toString(),
        });
      }

      // languageId
      if (applicationState.personalInformation.languageId) {
        const language = languages?._embedded.languages.find((o) => o.id === applicationState.personalInformation.languageId);
        if (language) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.personalInformation.languageId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.personalInformation.languageId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(language),
          });
        }
      }

      // isCanadianCitizen
      if (applicationState.personalInformation.isCanadianCitizen !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.isCanadianCitizen),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.isCanadianCitizen)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.isCanadianCitizen ? t('common:yes') : t('common:no'),
        });
      }

      // provindId
      if (applicationState.personalInformation.provinceId) {
        const province = provinces?._embedded.provinces.find((o) => o.id === applicationState.personalInformation.provinceId);
        if (province) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.personalInformation.provinceId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.personalInformation.provinceId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(province),
          });
        }
      }

      // internetQualityId
      if (applicationState.personalInformation.internetQualityId) {
        const internetQuality = internetQualities?._embedded.internetQualities.find((o) => o.id === applicationState.personalInformation.internetQualityId);
        if (internetQuality) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.personalInformation.internetQualityId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.personalInformation.internetQualityId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(internetQuality),
          });
        }
      }

      // hasDedicatedDevice
      if (applicationState.personalInformation.hasDedicatedDevice !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.personalInformation.hasDedicatedDevice),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.personalInformation.hasDedicatedDevice)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.personalInformation.hasDedicatedDevice ? t('common:yes') : t('common:no'),
        });
      }

      // discoveryChannelId
      if (applicationState.personalInformation.discoveryChannelId) {
        const discoveryChannel = discoveryChannels?._embedded.discoveryChannels.find((o) => o.id === applicationState.personalInformation.discoveryChannelId);
        if (discoveryChannel) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.personalInformation.discoveryChannelId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.personalInformation.discoveryChannelId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(discoveryChannel),
          });
        }
      }
    }

    if (Object.keys(applicationState.identityInformation).length !== 0) {
      // genderId
      if (applicationState.identityInformation.genderId) {
        const gender = genders?._embedded.genders.find((o) => o.id === applicationState.identityInformation.genderId);
        if (gender) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.genderId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.genderId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(gender),
          });
        }
      }

      // educationLevelId
      if (applicationState.identityInformation.educationLevelId) {
        const educationLevel = educationLevels?._embedded.educationLevels.find((o) => o.id === applicationState.identityInformation.educationLevelId);

        if (educationLevel) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.educationLevelId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.educationLevelId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(educationLevel),
          });
        }
      }

      // disabilityId
      if (applicationState.identityInformation.disabilityId) {
        const disability = disabilities?._embedded.disabilities.find((o) => o.id === applicationState.identityInformation.disabilityId);

        if (disability) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.disabilityId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.disabilityId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(disability),
          });
        }
      }

      // minorityId
      if (applicationState.identityInformation.minorityId) {
        const minority = minorities?._embedded.minorities.find((o) => o.id === applicationState.identityInformation.minorityId);

        if (minority) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.minorityId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.minorityId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(minority),
          });
        }
      }

      // indigenousTypeId
      if (applicationState.identityInformation.indigenousTypeId) {
        const indigenousType = indigenousTypes?._embedded.indigenousTypes.find((o) => o.id === applicationState.identityInformation.indigenousTypeId);

        if (indigenousType) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.indigenousTypeId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.indigenousTypeId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(indigenousType),
          });
        }
      }

      // sexualOrientationId
      if (applicationState.identityInformation.sexualOrientationId) {
        const sexualOrientation = sexualOrientations?._embedded.sexualOrientations.find((o) => o.id === applicationState.identityInformation.sexualOrientationId);

        if (sexualOrientation) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.sexualOrientationId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.sexualOrientationId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(sexualOrientation),
          });
        }
      }

      // ruralId
      if (applicationState.identityInformation.ruralId) {
        const rural = rurals?._embedded.ruralEntities.find((o) => o.id === applicationState.identityInformation.ruralId);

        if (rural) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.ruralId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.ruralId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(rural),
          });
        }
      }

      // newcomerId
      if (applicationState.identityInformation.newcomerId) {
        const newcomer = newcomers?._embedded.newcomers.find((o) => o.id === applicationState.identityInformation.newcomerId);

        if (newcomer) {
          items.push({
            key: nameof.full<ApplicationState>((o) => o.identityInformation.newcomerId),
            text: t(
              `application:step.${nameof
                .full<ApplicationState>((o) => o.identityInformation.newcomerId)
                .split('.')
                .map((s) => kebabCase(s))
                .join('.')}.label`
            ),
            value: getDescription(newcomer),
          });
        }
      }
    }

    if (Object.keys(applicationState.expressionOfInterest).length !== 0) {
      // skillsInterest
      if (applicationState.expressionOfInterest.skillsInterest) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.expressionOfInterest.skillsInterest),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.expressionOfInterest.skillsInterest)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.expressionOfInterest.skillsInterest,
        });
      }

      // communityInterest
      if (applicationState.expressionOfInterest.communityInterest) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.expressionOfInterest.communityInterest),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.expressionOfInterest.communityInterest)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.expressionOfInterest.communityInterest,
        });
      }

      // programInterest
      if (applicationState.expressionOfInterest.programInterest) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.expressionOfInterest.programInterest),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.expressionOfInterest.programInterest)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.expressionOfInterest.programInterest,
        });
      }
    }

    return items;
  }, [applicationState, t, getDescription, discoveryChannels, educationLevels, genders, indigenousTypes, internetQualities, languages, provinces]);

  return (
    <dl>
      {formReviewItems.map(({ key, text, value }, index) => (
        <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value} />
      ))}
    </dl>
  );
};

export default ConsentPage;
