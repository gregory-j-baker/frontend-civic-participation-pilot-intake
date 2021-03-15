/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useCallback } from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { TextAreaFieldOnChangeEvent } from '../../../components/form/TextAreaField';
import { TextAreaField } from '../../../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../../../components/form/TextField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent } from '../../../components/Wizard';
import { WizardStep } from '../../../components/WizardStep';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Alert, { AlertType } from '../../../components/Alert/Alert';
import { ApplyState, ExpressionOfInterestState, Constants } from '../types';
import { expressionOfInterestSchema, identityInformationSchema, personalInformationSchema } from '../validationSchemas';
import { ValidationError } from 'yup';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';

const Consent = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  const [schemaErrors, setSchemaErrors] = useState<string[] | null>();

  const [formData, setFormDataState] = useState<ApplyState>(() => {
    const defaultState: ApplyState = { personalInformation: {}, identityInformation: {}, expressionOfInterest: {}, consent: {} };

    if (typeof window === 'undefined') return defaultState;

    const storageData = window.sessionStorage.getItem(Constants.FormDataStorageKey);
    return { ...defaultState, ...(storageData ? JSON.parse(storageData) : {}) };
  });

  const [previousStepsValidationCompleted, setPreviousStepsValidationCompleted] = useState<boolean>(false);

  const validatePreviousSteps = useCallback(
    async (formData: ApplyState): Promise<void> => {
      if ((await personalInformationSchema.isValid(formData.personalInformation)) === false) {
        router.replace('/apply/personal-information');
      } else if ((await identityInformationSchema.isValid(formData.identityInformation)) === false) {
        router.replace('/apply/identity-information');
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

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      const newObj = { ...prev.expressionOfInterest, [field]: value ?? undefined };
      return { ...prev, expressionOfInterest: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event, activeStepId, nextStepId) => {
    event.preventDefault();

    router.push(`/apply/${kebabCase(nextStepId)}`);
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event, activeStepId, nextStepId) => {
    event.preventDefault();

    try {
      await expressionOfInterestSchema.validate(formData.expressionOfInterest, { abortEarly: false });
      router.push(`/apply/${kebabCase(nextStepId)}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        setSchemaErrors(err.errors);
        router.push(`/apply/${kebabCase(activeStepId)}#wb-cont`, undefined, { shallow: true });
      } else {
        throw err;
      }
    }
  };

  const getSchemaError = (field: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length == 0) return undefined;

    const index = schemaErrors.findIndex((key) => key.split('.')[0] === kebabCase(field));
    if (index === -1) return undefined;

    return t('common:error-number', { number: index + 1 }) + t(`apply:application-form.step.expression-of-interest.field.${schemaErrors[index]}`);
  };

  return (
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={t('apply:application-form.header')} />

          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
            {t('common:app.title')}
          </h1>
          <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('apply:application-form.header')}</h2>

          {schemaErrors && schemaErrors.length > 0 && (
            <Alert title={t('common:error-form-cannot-be-submitted', { count: schemaErrors.length })} type={AlertType.danger}>
              <ul className="tw-list-disc tw-list-inside">
                {schemaErrors.map((key) => {
                  const [field] = key.split('.');

                  return (
                    <li key={key} className="tw-my-2">
                      <a href={`#form-field-${camelCase(field)}`}>{getSchemaError(field)}</a>
                    </li>
                  );
                })}
              </ul>
            </Alert>
          )}

          <Wizard
            activeStepId={nameof<ApplyState>((o) => o.expressionOfInterest)}
            stepText={t('apply:application-form.wizard-step')}
            submitText={t('apply:application-form.submit')}
            onNextClick={handleWizardOnNextClick}
            onPreviousClick={handleWizardOnPreviousClick}>
            <WizardStep id={nameof<ApplyState>((o) => o.personalInformation)} />
            <WizardStep id={nameof<ApplyState>((o) => o.identityInformation)} />
            <WizardStep id={nameof<ApplyState>((o) => o.expressionOfInterest)} header={t('apply:application-form.step.expression-of-interest.header')}>
              <>
                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.skillsInterest)}
                  label={t('apply:application-form.step.expression-of-interest.field.skills-interest.label')}
                  value={formData.expressionOfInterest.skillsInterest}
                  onChange={handleOnTextFieldChange}
                  error={getSchemaError(nameof<ExpressionOfInterestState>((o) => o.skillsInterest))}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.communityInterest)}
                  label={t('apply:application-form.step.expression-of-interest.field.community-interest.label')}
                  value={formData.expressionOfInterest.communityInterest}
                  onChange={handleOnTextFieldChange}
                  error={getSchemaError(nameof<ExpressionOfInterestState>((o) => o.communityInterest))}
                  required
                  gutterBottom
                  className="tw-w-full"
                  wordLimit={250}
                />

                <TextAreaField
                  field={nameof<ExpressionOfInterestState>((o) => o.programInterest)}
                  label={t('apply:application-form.step.expression-of-interest.field.program-interest.label')}
                  value={formData.expressionOfInterest.programInterest}
                  onChange={handleOnTextFieldChange}
                  error={getSchemaError(nameof<ExpressionOfInterestState>((o) => o.programInterest))}
                  className="tw-w-full"
                  wordLimit={250}
                />
              </>
            </WizardStep>
            <WizardStep id={nameof<ApplyState>((o) => o.consent)} />
          </Wizard>
        </>
      )}
    </MainLayout>
  );
};

export default Consent;
