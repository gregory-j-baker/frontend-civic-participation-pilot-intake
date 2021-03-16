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
import { RadiosField, RadiosFieldOnChangeEvent, RadiosFieldOption } from '../../../components/form/RadiosField';
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../../components/form/SelectField';
import { SelectField } from '../../../components/form/SelectField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent } from '../../../components/Wizard';
import { WizardStep } from '../../../components/WizardStep';
import { theme } from '../../../config';
import useIndigenousTypes from '../../../hooks/api/useIndigenousTypes';
import useCurrentBreakpoint from '../../../hooks/useCurrentBreakpoint';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import Alert, { AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, GetDescriptionFunc, IdentityInformationState, Constants } from '../types';
import { identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';

const IdentityInformation = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();
  const currentBreakpoint = useCurrentBreakpoint();

  const { data: indigenousTypes, isLoading: isIndigenousTypesLoading, error: indigenousTypesError } = useIndigenousTypes();

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

      const newObj = { ...prev.identityInformation, [field]: newValue };
      return { ...prev, identityInformation: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event, activeStepId, nextStepId) => {
    event.preventDefault();

    router.push(`/application/${kebabCase(nextStepId)}`);
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event, activeStepId, nextStepId) => {
    event.preventDefault();

    try {
      await identityInformationSchema.validate(formData.identityInformation, { abortEarly: false });
      router.push(`/application/${kebabCase(nextStepId)}`);
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push(`/application/${kebabCase(activeStepId)}#wb-cont`, undefined, { shallow: true });
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // indigenous types select options
  const indigenousTypeOptions = useMemo<SelectFieldOption[]>(() => {
    if (isIndigenousTypesLoading || indigenousTypesError) return [];
    return [...(indigenousTypes?._embedded.indigenousTypes.map((el) => ({ value: el.id, text: getDescription(el) })) ?? []), { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') }];
  }, [t, isIndigenousTypesLoading, indigenousTypesError, indigenousTypes, getDescription]);

  const yesNoNoPreferNotAnswerOptions = useMemo<RadiosFieldOption[]>(
    () => [
      { value: true.toString(), text: t('common:yes') },
      { value: false.toString(), text: t('common:no') },
      { value: Constants.NoAnswerOptionValue, text: t('common:prefer-not-answer') },
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
        `application:step.identity-information.${schemaErrors[index]?.path
          ?.split('.')
          .map((el) => kebabCase(el))
          .join('.')}.${key}`
      )
    );
  };

  if (indigenousTypesError) {
    return <Error err={indigenousTypesError as HttpClientResponseError} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted || isIndigenousTypesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step.identity-information.header')} - ${t('application:header')}`} />

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

          <Wizard activeStepId={nameof<ApplicationState>((o) => o.identityInformation)} stepText={t('application:wizard-step')} submitText={t('application:submit')} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick}>
            <WizardStep id={nameof<ApplicationState>((o) => o.personalInformation)} />
            <WizardStep id={nameof<ApplicationState>((o) => o.identityInformation)} header={t('application:step.identity-information.header')}>
              <>
                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isDisabled)}
                  label={t('application:step.identity-information.is-disabled.label')}
                  value={formData.identityInformation.isDisabled === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isDisabled?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.isDisabled))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isMinority)}
                  label={t('application:step.identity-information.is-minority.label')}
                  value={formData.identityInformation.isMinority === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isMinority?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.isMinority))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <SelectField
                  field={nameof<IdentityInformationState>((o) => o.indigenousTypeId)}
                  label={t('application:step.identity-information.indigenous-type-id.label')}
                  value={formData.identityInformation.indigenousTypeId === null ? Constants.NoAnswerOptionValue : formData.identityInformation.indigenousTypeId?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={indigenousTypeOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.indigenousTypeId))}
                  required
                  gutterBottom
                  className="tw-w-full sm:tw-w-6/12"
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isLgbtq)}
                  label={t('application:step.identity-information.is-lgbtq.label')}
                  value={formData.identityInformation.isLgbtq === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isLgbtq?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.isLgbtq))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isRural)}
                  label={t('application:step.identity-information.is-rural.label')}
                  value={formData.identityInformation.isRural === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isRural?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.isRural))}
                  required
                  gutterBottom
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />

                <RadiosField
                  field={nameof<IdentityInformationState>((o) => o.isNewcomer)}
                  label={t('application:step.identity-information.is-newcomer.label')}
                  value={formData.identityInformation.isNewcomer === null ? Constants.NoAnswerOptionValue : formData.identityInformation.isNewcomer?.toString()}
                  onChange={handleOnOptionsFieldChange}
                  options={yesNoNoPreferNotAnswerOptions}
                  error={getSchemaError(nameof<IdentityInformationState>((o) => o.isNewcomer))}
                  required
                  inline={currentBreakpoint === undefined || currentBreakpoint >= theme.breakpoints.sm}
                />
              </>
            </WizardStep>
            <WizardStep id={nameof<ApplicationState>((o) => o.expressionOfInterest)} />
            <WizardStep id={nameof<ApplicationState>((o) => o.consent)} />
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

export default IdentityInformation;
