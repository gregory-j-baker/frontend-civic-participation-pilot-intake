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
import useSubmitApplication, { ApplicationData } from '../../../hooks/api/useSubmitApplication';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import Alert, { AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, ConsentState, Constants, GetDescriptionFunc } from '../types';
import { consentSchema, expressionOfInterestSchema, applicationSchema, identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { FormDefinitionListItem } from '../../../components/FormDefinitionListItem';
import useDiscoveryChannels from '../../../hooks/api/useDiscoveryChannels';
import useInternetQualities from '../../../hooks/api/useInternetQualities';
import useLanguages from '../../../hooks/api/useLanguages';
import useProvinces from '../../../hooks/api/useProvinces';
import useEducationLevels from '../../../hooks/api/useEducationLevels';
import useGenders from '../../../hooks/api/useGenders';
import useIndigenousTypes from '../../../hooks/api/useIndigenousTypes';
import { sleep } from '../../../utils/misc-utils';

const ConsentPage = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: submitApplication, error: submitApplicationError, isLoading: submitApplicationIsLoading, isSuccess: submitApplicationIsSuccess } = useSubmitApplication();

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

  useEffect(() => {
    if (submitApplicationIsSuccess) {
      window.sessionStorage.removeItem(Constants.FormDataStorageKey);
      router.push('/application/confirmation');
    }
  }, [submitApplicationIsSuccess, router]);

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
        const applicationData: ApplicationData = {
          birthYear: formData.personalInformation.birthYear as number,
          communityInterest: formData.expressionOfInterest.communityInterest as string,
          discoveryChannelId: formData.personalInformation.discoveryChannelId as string,
          educationLevelId: formData.identityInformation.educationLevelId as string | null,
          email: formData.personalInformation.email as string,
          firstName: formData.personalInformation.firstName as string,
          genderId: formData.identityInformation.genderId as string | null,
          hasDedicatedDevice: formData.personalInformation.hasDedicatedDevice as boolean,
          indigenousTypeId: formData.identityInformation.indigenousTypeId as string,
          internetQualityId: formData.personalInformation.internetQualityId as string,
          isCanadianCitizen: formData.personalInformation.isCanadianCitizen as boolean,
          isDisabled: formData.identityInformation.isDisabled as boolean | null,
          isLgbtq: formData.identityInformation.isLgbtq as boolean | null,
          isMinority: formData.identityInformation.isMinority as boolean | null,
          isNewcomer: formData.identityInformation.isNewcomer as boolean | null,
          isRural: formData.identityInformation.isRural as boolean | null,
          languageId: formData.personalInformation.languageId as string,
          lastName: formData.personalInformation.languageId as string,
          phoneNumber: formData.personalInformation.phoneNumber,
          programInterest: formData.expressionOfInterest.programInterest,
          provinceId: formData.personalInformation.provinceId as string,
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
            <FormReview applicationState={formData} />
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

  const { data: discoveryChannels } = useDiscoveryChannels();
  const { data: educationLevels } = useEducationLevels();
  const { data: genders } = useGenders();
  const { data: indigenousTypes } = useIndigenousTypes();
  const { data: internetQualities } = useInternetQualities();
  const { data: languages } = useLanguages();
  const { data: provinces } = useProvinces();

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
        if (discoveryChannel)
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

    if (Object.keys(applicationState.identityInformation).length !== 0) {
      // genderId
      if (applicationState.identityInformation.genderId !== undefined && genders) {
        const gender = genders._embedded.genders.find((o) => (applicationState.identityInformation.genderId === null ? false : o.id === applicationState.identityInformation.indigenousTypeId));
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.genderId),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.genderId)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: gender ? getDescription(gender) : t('common:prefer-not-answer'),
        });
      }

      // educationLevelId
      if (applicationState.identityInformation.educationLevelId !== undefined && educationLevels) {
        const educationLevel = educationLevels._embedded.educationLevels.find((o) => (applicationState.identityInformation.educationLevelId === null ? false : o.id === applicationState.identityInformation.educationLevelId));
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.educationLevelId),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.educationLevelId)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: educationLevel ? getDescription(educationLevel) : t('common:prefer-not-answer'),
        });
      }

      // isDisabled
      if (applicationState.identityInformation.isDisabled !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.isDisabled),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.isDisabled)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.identityInformation.isDisabled === true ? t('common:yes') : applicationState.identityInformation.isDisabled === false ? t('common:no') : t('common:prefer-not-answer'),
        });
      }

      // isMinority
      if (applicationState.identityInformation.isMinority !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.isMinority),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.isMinority)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.identityInformation.isMinority === true ? t('common:yes') : applicationState.identityInformation.isMinority === false ? t('common:no') : t('common:prefer-not-answer'),
        });
      }

      // indigenousTypeId
      if (applicationState.identityInformation.indigenousTypeId !== undefined && indigenousTypes) {
        const indigenousType = indigenousTypes._embedded.indigenousTypes.find((o) => (applicationState.identityInformation.indigenousTypeId === null ? false : o.id === applicationState.identityInformation.indigenousTypeId));
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.indigenousTypeId),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.indigenousTypeId)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: indigenousType ? getDescription(indigenousType) : t('common:prefer-not-answer'),
        });
      }

      // isLgbtq
      if (applicationState.identityInformation.isLgbtq !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.isLgbtq),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.isLgbtq)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.identityInformation.isLgbtq === true ? t('common:yes') : applicationState.identityInformation.isLgbtq === false ? t('common:no') : t('common:prefer-not-answer'),
        });
      }

      // isRural
      if (applicationState.identityInformation.isRural !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.isRural),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.isRural)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.identityInformation.isRural === true ? t('common:yes') : applicationState.identityInformation.isRural === false ? t('common:no') : t('common:prefer-not-answer'),
        });
      }

      // isNewcomer
      if (applicationState.identityInformation.isNewcomer !== undefined) {
        items.push({
          key: nameof.full<ApplicationState>((o) => o.identityInformation.isNewcomer),
          text: t(
            `application:step.${nameof
              .full<ApplicationState>((o) => o.identityInformation.isNewcomer)
              .split('.')
              .map((s) => kebabCase(s))
              .join('.')}.label`
          ),
          value: applicationState.identityInformation.isNewcomer === true ? t('common:yes') : applicationState.identityInformation.isNewcomer === false ? t('common:no') : t('common:prefer-not-answer'),
        });
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
    <dl className="tw-mb-10">
      {formReviewItems.map(({ key, text, value }, index) => (
        <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value} />
      ))}
    </dl>
  );
};

export default ConsentPage;
