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
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnPreviousClickEvent, WizardOnSubmitClickEvent } from '../../../components/Wizard';
import { WizardStep } from '../../../components/WizardStep';
import { theme } from '../../../config';
import useDiscoveryChannels from '../../../hooks/api/useDiscoveryChannels';
import useInternetQualities from '../../../hooks/api/useInternetQualities';
import useSubmitApplication from '../../../hooks/api/useSubmitApplication';
import useCurrentBreakpoint from '../../../hooks/useCurrentBreakpoint';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import Alert, { AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, ConsentState, GetDescriptionFunc, Constants } from '../types';
import { consentSchema, expressionOfInterestSchema, applicationSchema, identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';

const ApplicationSection = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { isLoading: isSubmitting, error: submitError, mutate: submitApplication } = useSubmitApplication();

  const { data: discoveryChannels, isLoading: isDiscoveryChannelsLoading, error: discoveryChannelsError } = useDiscoveryChannels();
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities();

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

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent & RadiosFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      let newValue = undefined;

      if (value) {
        if (value.toLowerCase() === 'true') newValue = true;
        else if (value.toLowerCase() === 'false') newValue = false;
        else if (value.toLowerCase() === Constants.NoAnswerOptionValue.toLowerCase()) newValue = null;
        else if (!isNaN(Number(value))) newValue = Number(value);
        else newValue = value;
      }

      const newObj = { ...prev.consent, [field]: newValue };
      return { ...prev, consent: newObj };
    });
  };

  const handleOnCheckboxFieldChange: CheckboxeFieldOnChangeEvent = ({ field, checked }) => {
    setFormDataState((prev) => {
      const newObj = { ...prev.consent, [field]: checked };
      return { ...prev, consent: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event, activeStepId, nextStepId) => {
    event.preventDefault();

    router.push(`/application/${kebabCase(nextStepId)}`);
  };

  const handleWizardOnSubmitClick: WizardOnSubmitClickEvent = async (event, activeStepId) => {
    event.preventDefault();

    // validate consent schema
    try {
      await consentSchema.validate(formData.consent, { abortEarly: false });

      if (await applicationSchema.isValid(formData)) {
        // submit appplication
        submitApplication({
          ...formData.personalInformation,
          ...formData.identityInformation,
          ...formData.expressionOfInterest,
          ...formData.consent,
        });
      }
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push(`/application/${kebabCase(activeStepId)}#wb-cont`, undefined, { shallow: true });
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

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
        `application:step.consent.${schemaErrors[index]?.path
          ?.split('.')
          .map((el) => kebabCase(el))
          .join('.')}.${key}`
      )
    );
  };

  if (discoveryChannelsError || internetQualitiesError || internetQualitiesError || submitError) {
    return <Error err={(discoveryChannelsError ?? internetQualitiesError ?? internetQualitiesError ?? submitError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted || isDiscoveryChannelsLoading || isInternetQualitiesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step.consent.header')} - ${t('application:header')}`} />

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
            activeStepId={nameof<ApplicationState>((o) => o.consent)}
            stepText={t('application:wizard-step')}
            submitText={t('application:submit')}
            onPreviousClick={handleWizardOnPreviousClick}
            onSubmitClick={handleWizardOnSubmitClick}
            disabled={isSubmitting}>
            <WizardStep id={nameof<ApplicationState>((o) => o.personalInformation)} />
            <WizardStep id={nameof<ApplicationState>((o) => o.identityInformation)} />
            <WizardStep id={nameof<ApplicationState>((o) => o.expressionOfInterest)} />
            <WizardStep id={nameof<ApplicationState>((o) => o.consent)} header={t('application:step.consent.header')}>
              <>
                <SelectField
                  field={nameof<ConsentState>((o) => o.internetQualityId)}
                  label={t('application:step.consent.internet-quality-id.label')}
                  value={formData.consent.internetQualityId}
                  onChange={handleOnOptionsFieldChange}
                  options={internetQualityOptions}
                  disabled={isSubmitting}
                  error={getSchemaError(nameof<ConsentState>((o) => o.internetQualityId))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<ConsentState>((o) => o.hasDedicatedDevice)}
                  label={t('application:step.consent.has-dedicated-device.label')}
                  value={formData.consent.hasDedicatedDevice?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  disabled={isSubmitting}
                  error={getSchemaError(nameof<ConsentState>((o) => o.hasDedicatedDevice))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<ConsentState>((o) => o.discoveryChannelId)}
                  label={t('application:step.consent.discovery-channel-id.label')}
                  value={formData.consent.discoveryChannelId}
                  onChange={handleOnOptionsFieldChange}
                  options={discoveryChannelOptions}
                  disabled={isSubmitting}
                  error={getSchemaError(nameof<ConsentState>((o) => o.discoveryChannelId))}
                  required
                  className="tw-w-full sm:tw-w-6/12"
                  gutterBottom
                />

                <CheckboxeField
                  field={nameof<ConsentState>((o) => o.isInformationConsented)}
                  label={t('application:step.consent.is-information-consented.label')}
                  checked={formData.consent.isInformationConsented}
                  onChange={handleOnCheckboxFieldChange}
                  disabled={isSubmitting}
                  error={getSchemaError(nameof<ConsentState>((o) => o.isInformationConsented))}
                />
              </>
            </WizardStep>
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

export default ApplicationSection;
