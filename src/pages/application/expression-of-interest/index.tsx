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
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import { Alert, AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, ExpressionOfInterestState, Constants } from '../types';
import { expressionOfInterestSchema, identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { sleep } from '../../../utils/misc-utils';

const ApplicationConsentPage = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

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

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();
    router.push('/application/identity-information');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await expressionOfInterestSchema.validate(formData.expressionOfInterest, { abortEarly: false });
      router.push('/application/consent');
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push('/application/expression-of-interest#wb-cont', undefined, { shallow: true });
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

  return (
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-3.title')} - ${t('application:header')}`} />

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

          <Wizard activeStep={3} numberOfSteps={4} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick}>
            <TextAreaField
              field={nameof<ExpressionOfInterestState>((o) => o.skillsInterest)}
              label={t('application:field.skills-interest.label')}
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
              label={t('application:field.community-interest.label')}
              value={formData.expressionOfInterest.communityInterest}
              onChange={handleOnTextFieldChange}
              error={getSchemaError(nameof<ExpressionOfInterestState>((o) => o.communityInterest))}
              required
              gutterBottom
              className="tw-w-full"
              wordLimit={250}
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

export default ApplicationConsentPage;
