/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo, useState, useEffect, useCallback } from 'react';
import type { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
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
import useDiscoveryChannels, { discoveryChannelsStaticProps, discoveryChannelsQueryKey } from '../../../hooks/api/useDiscoveryChannels';
import useInternetQualities, { internetQualitiesStaticProps, internetQualitiesQueryKey } from '../../../hooks/api/useInternetQualities';
import useSubmitApplication from '../../../hooks/api/useSubmitApplication';
import useCurrentBreakpoint from '../../../hooks/useCurrentBreakpoint';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import Alert, { AlertType } from '../../../components/Alert/Alert';
import { ApplyState, ConsentState, GetDescriptionFunc, Constants } from '../types';
import { formSchema } from '../validationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import Link from 'next/link';

const ApplySection = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { isLoading: isSubmitting, error: submitError, mutate: submitApplication } = useSubmitApplication();

  const { data: discoveryChannels, isLoading: isDiscoveryChannelsLoading, error: discoveryChannelsError } = useDiscoveryChannels();
  const { data: internetQualities, isLoading: isInternetQualitiesLoading, error: internetQualitiesError } = useInternetQualities();

  const [formSchemaErrors, setFormSchemaErrors] = useState<string[] | null>();

  const [formData, setFormDataState] = useState<ApplyState>(() => {
    const defaultState: ApplyState = { personalInformation: {}, identityInformation: {}, expressionOfInterest: {}, consent: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

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

    router.push(`/apply/${kebabCase(nextStepId)}`);
  };

  const handleWizardOnSubmitClick: WizardOnSubmitClickEvent = async (event, activeStepId) => {
    event.preventDefault();

    // validate form schema
    try {
      await formSchema.validate(formData, { abortEarly: false });

      // submit appplication
      submitApplication({
        ...formData.personalInformation,
        ...formData.identityInformation,
        ...formData.expressionOfInterest,
        ...formData.consent,
      });
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setFormSchemaErrors(err.errors);
      router.push(`/apply/${kebabCase(activeStepId)}#wb-cont`, undefined, { shallow: true });
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

  const getConsentSchemaError = (field: string): string | undefined => {
    if (!formSchemaErrors || formSchemaErrors.length === 0) return undefined;

    const index = formSchemaErrors.findIndex((key) => key.split('.')[0] === 'consent' && key.split('.')[1] === kebabCase(field));
    if (index === -1) return undefined;

    const [, ...errosKeys] = formSchemaErrors[index].split('.');
    return t('common:error-number', { number: index + 1 }) + t(`apply:application-form.step.consent.field.${errosKeys.join('.')}`);
  };

  if (discoveryChannelsError || internetQualitiesError || internetQualitiesError || submitError) {
    return <Error err={(discoveryChannelsError ?? internetQualitiesError ?? internetQualitiesError ?? submitError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      <NextSeo title={t('apply:application-form.header')} />
      <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
        {t('common:app.title')}
      </h1>
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('apply:application-form.header')}</h2>
      {isDiscoveryChannelsLoading || isInternetQualitiesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          {formSchemaErrors && formSchemaErrors.length > 0 && (
            <Alert title={t('common:error-form-cannot-be-submitted', { count: formSchemaErrors.length })} type={AlertType.danger}>
              <ul className="tw-list-disc tw-list-inside">
                {formSchemaErrors.map((key, index) => {
                  const [section, field, msgkey] = key.split('.');
                  return (
                    <li key={key} className="tw-my-2">
                      <Link href={`/apply/${section}` + (section === 'consent' ? `#form-field-${camelCase(field)}` : '')} shallow>
                        <a>{t('common:error-number', { number: index + 1 }) + t(`apply:application-form.step.${section}.field.${field}.${msgkey}`.replace('.undefined', ''))}</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Alert>
          )}

          <Wizard
            activeStepId={nameof<ApplyState>((o) => o.consent)}
            stepText={t('apply:application-form.wizard-step')}
            submitText={t('apply:application-form.submit')}
            onPreviousClick={handleWizardOnPreviousClick}
            onSubmitClick={handleWizardOnSubmitClick}
            disabled={isSubmitting}>
            <WizardStep id={nameof<ApplyState>((o) => o.personalInformation)} />
            <WizardStep id={nameof<ApplyState>((o) => o.identityInformation)} />
            <WizardStep id={nameof<ApplyState>((o) => o.expressionOfInterest)} />
            <WizardStep id={nameof<ApplyState>((o) => o.consent)} header={t('apply:application-form.step.consent.header')}>
              <>
                <SelectField
                  field={nameof<ConsentState>((o) => o.internetQualityId)}
                  label={t('apply:application-form.step.consent.field.internet-quality-id.label')}
                  value={formData.consent.internetQualityId}
                  onChange={handleOnOptionsFieldChange}
                  options={internetQualityOptions}
                  disabled={isSubmitting}
                  error={getConsentSchemaError(nameof<ConsentState>((o) => o.internetQualityId))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<ConsentState>((o) => o.hasDedicatedDevice)}
                  label={t('apply:application-form.step.consent.field.has-dedicated-device.label')}
                  value={formData.consent.hasDedicatedDevice?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoOptions}
                  disabled={isSubmitting}
                  error={getConsentSchemaError(nameof<ConsentState>((o) => o.hasDedicatedDevice))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<ConsentState>((o) => o.discoveryChannelId)}
                  label={t('apply:application-form.step.consent.field.discovery-channel-id.label')}
                  value={formData.consent.discoveryChannelId}
                  onChange={handleOnOptionsFieldChange}
                  options={discoveryChannelOptions}
                  disabled={isSubmitting}
                  error={getConsentSchemaError(nameof<ConsentState>((o) => o.discoveryChannelId))}
                  required
                  className="tw-w-full sm:tw-w-6/12"
                  gutterBottom
                />

                <CheckboxeField
                  field={nameof<ConsentState>((o) => o.isInformationConsented)}
                  label={t('apply:application-form.step.consent.field.is-information-consented.label')}
                  checked={formData.consent.isInformationConsented}
                  onChange={handleOnCheckboxFieldChange}
                  disabled={isSubmitting}
                  error={getConsentSchemaError(nameof<ConsentState>((o) => o.isInformationConsented))}
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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(discoveryChannelsQueryKey, () => discoveryChannelsStaticProps);
  await queryClient.prefetchQuery(internetQualitiesQueryKey, () => internetQualitiesStaticProps);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default ApplySection;
