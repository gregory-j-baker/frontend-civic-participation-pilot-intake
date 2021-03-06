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
import type { TextAreaFieldOnChangeEvent } from '../../components/form/TextAreaField';
import { TextAreaField } from '../../components/form/TextAreaField';
import type { TextFieldOnChangeEvent } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent } from '../../components/Wizard';
import { Alert, AlertType } from '../../components/Alert';
import { ApplicationState, Step3State, Constants } from './types';
import { step3Schema, step2Schema, step1Schema, SkillsInterestWordLength } from '../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { YupCustomMessage } from '../../yup/types';
import { GetStaticProps } from 'next';
import { sleep } from '../../utils/misc-utils';

const Step3Page = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

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
      } else {
        setPreviousStepsValidationCompleted(true);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!previousStepsValidationCompleted) validatePreviousSteps(formData);
  }, [validatePreviousSteps, previousStepsValidationCompleted, formData]);

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, step3: { ...prev.step3, [field]: value ?? undefined } }));
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
    router.push('/application/step-2');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await step3Schema.validate(formData.step3, { abortEarly: false });
      window.sessionStorage.setItem(Constants.FormDataStorageKey, JSON.stringify(formData));
      router.push('/application/step-4');
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

    return (
      t('common:error-number', { number: index + 1 }) +
      t(`application:field.${schemaErrors[index]?.path}.${key}`, {
        min: (schemaErrors[index].params?.min ?? -1) as number,
        max: (schemaErrors[index].params?.max ?? -1) as number,
      })
    );
  };

  return (
    <MainLayout>
      {!previousStepsValidationCompleted ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-3.title')} - ${t('application:header')}`} />

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

          <Wizard activeStep={3} numberOfSteps={4} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick}>
            <p className="tw-m-0 tw-mb-10 tw-font-bold">{t('application:step-3.information-note')}</p>

            <TextAreaField
              field={nameof<Step3State>((o) => o.communityInterest)}
              label={t('application:field.communityInterest.label')}
              helperText={t('application:field.communityInterest.helper-text', { ...SkillsInterestWordLength })}
              value={formData.step3.communityInterest}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<Step3State>((o) => o.communityInterest))}
              required
              gutterBottom
              className="tw-w-full"
              wordLimit={250}
              maxLength={2048}
            />

            <TextAreaField
              field={nameof<Step3State>((o) => o.skillsInterest)}
              label={t('application:field.skillsInterest.label')}
              helperText={t('application:field.skillsInterest.helper-text', { ...SkillsInterestWordLength })}
              value={formData.step3.skillsInterest}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<Step3State>((o) => o.skillsInterest))}
              required
              className="tw-w-full"
              wordLimit={250}
              maxLength={2048}
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

export default Step3Page;
