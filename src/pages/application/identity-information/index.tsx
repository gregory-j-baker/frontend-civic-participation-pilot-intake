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
import type { SelectFieldOnChangeEvent, SelectFieldOption } from '../../../components/form/SelectField';
import { SelectField } from '../../../components/form/SelectField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Wizard, WizardOnNextClickEvent, WizardOnPreviousClickEvent } from '../../../components/Wizard';
import { useEducationLevels } from '../../../hooks/api/code-lookups/useEducationLevels';
import { useGenders } from '../../../hooks/api/code-lookups/useGenders';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Error from '../../_error';
import { Alert, AlertType } from '../../../components/Alert/Alert';
import { ApplicationState, GetDescriptionFunc, IdentityInformationState, Constants } from '../types';
import { identityInformationSchema, personalInformationSchema } from '../../../yup/applicationSchemas';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { sleep } from '../../../utils/misc-utils';

const ApplicationIdentityInformationPage = (): JSX.Element => {
  const { lang, t } = useTranslation();
  const router = useRouter();

  const { data: educationLevels, isLoading: isEducationLevelsLoading, error: educationLevelsError } = useEducationLevels({ lang });
  const { data: genders, isLoading: isGendersLoading, error: gendersError } = useGenders({ lang });

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

  const handleOnOptionsFieldChange: SelectFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      let newValue: boolean | string | null | undefined = undefined;

      if (value) {
        if (value.toLowerCase() === 'true') newValue = true;
        else if (value.toLowerCase() === 'false') newValue = false;
        else newValue = value;
      }

      const newObj = { ...prev.identityInformation, [field]: newValue };
      return { ...prev, identityInformation: newObj };
    });
  };

  const handleWizardOnPreviousClick: WizardOnPreviousClickEvent = (event) => {
    event.preventDefault();

    router.push('/application/personal-information');
  };

  const handleWizardOnNextClick: WizardOnNextClickEvent = async (event) => {
    event.preventDefault();

    try {
      await identityInformationSchema.validate(formData.identityInformation, { abortEarly: false });
      router.push('/application/expression-of-interest');
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      router.push('/application/identity-information#wb-cont', undefined, { shallow: true });
    }
  };

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // gender select options
  const genderOptions = useMemo<SelectFieldOption[]>(() => {
    if (isGendersLoading || gendersError) return [];
    return genders?._embedded.genders.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isGendersLoading, gendersError, genders, getDescription]);

  // education level select options
  const educationLevelOptions = useMemo<SelectFieldOption[]>(() => {
    if (isEducationLevelsLoading || educationLevelsError) return [];
    return educationLevels?._embedded.educationLevels.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isEducationLevelsLoading, educationLevelsError, educationLevels, getDescription]);

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

  if (gendersError || educationLevelsError) {
    return <Error err={(gendersError ?? educationLevelsError) as HttpClientResponseError} />;
  }

  return (
    <MainLayout showBreadcrumb={false}>
      {!previousStepsValidationCompleted || isGendersLoading || isEducationLevelsLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={`${t('application:step-2.title')} - ${t('application:header')}`} />

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

          <Wizard activeStep={2} numberOfSteps={4} onNextClick={handleWizardOnNextClick} onPreviousClick={handleWizardOnPreviousClick}>
            <p className="tw-m-0 tw-mb-10 tw-font-bold">{t('application:step-2.information-note-1')}</p>

            <SelectField
              field={nameof<IdentityInformationState>((o) => o.genderId)}
              label={t('application:field.gender-id.label')}
              value={formData.identityInformation.genderId}
              onChange={handleOnOptionsFieldChange}
              options={genderOptions}
              error={getSchemaError(nameof<IdentityInformationState>((o) => o.genderId))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-6/12"
            />

            <SelectField
              field={nameof<IdentityInformationState>((o) => o.educationLevelId)}
              label={t('application:field.education-level-id.label')}
              helperText={t('application:field.education-level-id.helper-text')}
              value={formData.identityInformation.educationLevelId}
              onChange={handleOnOptionsFieldChange}
              options={educationLevelOptions}
              error={getSchemaError(nameof<IdentityInformationState>((o) => o.educationLevelId))}
              required
              gutterBottom
              className="tw-w-full"
            />

            <p className="tw-m-0 tw-mb-8 tw-font-bold">{t('application:step-2.information-note-2')}</p>
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

export default ApplicationIdentityInformationPage;
