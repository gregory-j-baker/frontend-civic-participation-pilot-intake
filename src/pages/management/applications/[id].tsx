/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { AADSession, Role } from '../../../common/types';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { fetchApplication } from '../../../hooks/api/applications/useApplication';
import { getSession, signIn } from 'next-auth/client';
import { ApplicationReview } from '../../../components/pages/ApplicationReview';
import { Application } from '../../../hooks/api/applications/types';
import { ContentPaper } from '../../../components/ContentPaper';
import useTranslation from 'next-translate/useTranslation';
import { NextSeo } from 'next-seo';
import { SelectField, SelectFieldOption } from '../../../components/form/SelectField';
import { useApplicationStatuses } from '../../../hooks/api/code-lookups/useApplicationStatuses';
import { GetDescriptionFunc } from '../../application/types';
import Error from '../../_error';
import { TextAreaField } from '../../../components/form/TextAreaField';
import { ButtonLink } from '../../../components/ButtonLink';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import { Alert, AlertType } from '../../../components/Alert';
import { ValidationError } from 'yup';
import { applicationEditSchema } from '../../../yup/applicationEditSchema';
import { YupCustomMessage } from '../../../yup/types';
import { ApplicationStatus } from '../../../hooks/api/code-lookups/types';
import Trans from 'next-translate/Trans';
import { useSaveApplication } from '../../../hooks/api/applications/useSaveApplication';
import { useRouter } from 'next/router';

export interface ManagementEditApplicationPageState {
  applicationStatusId?: string;
  reasoning?: string;
}

export interface ManagementEditApplicationPageProps {
  application: Application;
}

const ManagementEditApplicationPage = ({ application }: ManagementEditApplicationPageProps): JSX.Element => {
  const { t, lang } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<ManagementEditApplicationPageState>({});
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading, error: applicationStatusesError } = useApplicationStatuses({ lang });
  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const { mutate: saveApplication, error: saveApplicationError, isLoading: saveApplicationIsLoading } = useSaveApplication({
    onSuccess: () => {
      router.push(`/management/applications?status=${application.applicationStatusId}`);
    },
  });

  const handleSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    try {
      await applicationEditSchema.validate(formData, { abortEarly: false });
      setSchemaErrors(null);
      setShowConfirm(true);
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      document.getElementById('validation-error')?.focus();
    }
  };

  const handleConfirmSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    saveApplication({
      id: application.id,
      applicationStatusId: formData.applicationStatusId as string,
      reasonText: formData.reasoning as string,
    });
  };

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return t('common:error-number', { number: index + 1 }) + t(`application:management.edit.field.${schemaErrors[index]?.path}.${key}`);
  };

  // application statuse options
  const applicationStatuseOptions = useMemo<SelectFieldOption[]>(() => {
    if (isApplicationStatusesLoading || applicationStatusesError) return [];
    return applicationStatuses?._embedded.applicationStatuses.filter(({ id }) => id !== application.applicationStatusId).map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isApplicationStatusesLoading, applicationStatusesError, applicationStatuses, application.applicationStatusId, getDescription]);

  if (applicationStatusesError || saveApplicationError) {
    return <Error err={applicationStatusesError || saveApplicationError} />;
  }

  return (
    <MainLayout>
      <NextSeo title={t('application:management.edit.title')} />

      <h2 className="tw-m-0 tw-mb-8 tw-text-2xl">{t('application:management.edit.header')}</h2>

      <h3 className="tw-m-0 tw-mb-8 tw-text-xxl tw-text-gray-500">
        <span className="tw-block tw-mb-2">{`${application.firstName} ${application.lastName}`}</span>
        {dateTimeFormat.format(new Date(application.createdDate))}
      </h3>

      {!isApplicationStatusesLoading && !showConfirm && (
        <>
          <ContentPaper className="tw-mb-10">
            <ApplicationReview application={application} />
          </ContentPaper>

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

          <ContentPaper>
            <SelectField
              field={nameof<ManagementEditApplicationPageState>((o) => o.applicationStatusId)}
              label={t('application:management.edit.field.applicationStatusId.label')}
              value={formData.applicationStatusId}
              options={applicationStatuseOptions}
              onChange={({ value }) => setFormData((prev) => ({ ...prev, applicationStatusId: value ?? undefined }))}
              error={getSchemaError(nameof<ManagementEditApplicationPageState>((o) => o.applicationStatusId))}
              gutterBottom
              required
              className="tw-w-full sm:tw-w-6/12"
            />

            <TextAreaField
              field={nameof<ManagementEditApplicationPageState>((o) => o.reasoning)}
              label={t('application:management.edit.field.reasoning.label')}
              value={formData.reasoning}
              onChange={({ value }) => setFormData((prev) => ({ ...prev, reasoning: value ?? undefined }))}
              error={getSchemaError(nameof<ManagementEditApplicationPageState>((o) => o.reasoning))}
              gutterBottom
              required
              className="tw-w-full"
            />

            <Button className="tw-m-2" onClick={handleSubmit}>
              {t('application:management.edit.submit')}
            </Button>
            <ButtonLink className="tw-m-2" href={`/management/applications?status=${application.applicationStatusId}`} outline>
              {t('application:management.edit.cancel')}
            </ButtonLink>
          </ContentPaper>
        </>
      )}

      {showConfirm && !schemaErrors && applicationStatuses && (
        <Confirm
          application={application}
          applicationStatuses={applicationStatuses._embedded.applicationStatuses}
          applicationStatusId={formData.applicationStatusId as string}
          disabled={saveApplicationIsLoading}
          reasoning={formData.reasoning as string}
          onConfirmClick={handleConfirmSubmit}
          onCancelClick={() => setShowConfirm(false)}
        />
      )}
    </MainLayout>
  );
};

export interface SubmitConfirmationProps {
  application: Application;
  applicationStatuses: ApplicationStatus[];
  applicationStatusId: string;
  disabled: boolean;
  onConfirmClick?: ButtonOnClickEvent;
  onCancelClick?: ButtonOnClickEvent;
  reasoning: string;
}

const Confirm = ({ application, applicationStatuses, applicationStatusId, disabled, onConfirmClick, onCancelClick, reasoning }: SubmitConfirmationProps): JSX.Element => {
  const { t, lang } = useTranslation();
  const wrapperEl = useRef<HTMLDivElement>(null);

  const currentStatus = applicationStatuses.find(({ id }) => id === application.applicationStatusId) as ApplicationStatus;
  const newStatus = applicationStatuses.find(({ id }) => id === applicationStatusId) as ApplicationStatus;

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  useEffect(() => {
    wrapperEl.current?.querySelector('section')?.focus();
  }, []);

  return (
    <div ref={wrapperEl}>
      <ContentPaper tabIndex={-1} disablePadding>
        <div className="tw-flex tw-flex-col">
          <div className="tw-py-4 tw-px-6 tw-border-b-2">
            <div className="tw-text-xl tw-font-bold tw-mb-8">{t('application:management.edit.confirm.title')}</div>
            <p className="tw-mb-6">
              <Trans
                i18nKey="application:management.edit.confirm.message"
                components={{ label: <span className="tw-font-bold" /> }}
                values={{
                  name: `${application.firstName} ${application.lastName}`,
                  current: getDescription(currentStatus),
                  new: getDescription(newStatus),
                }}
              />
            </p>
            <blockquote className="tw-border-green-600 tw-m-0">{reasoning}</blockquote>
          </div>
          <div className="tw-ml-auto tw-p-2">
            <Button className="tw-m-2" onClick={onConfirmClick} disabled={disabled}>
              {t('application:management.edit.confirm.submit')}
            </Button>
            <Button className="tw-m-2" outline onClick={onCancelClick} disabled={disabled}>
              {t('application:management.edit.confirm.cancel')}
            </Button>
          </div>
        </div>
      </ContentPaper>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as AADSession;
  if (!session || Date.now() >= session.accessTokenExpires || !session.accessToken) signIn('azure-ad-b2c');

  const { id } = context.params as { id: string };
  const application = await fetchApplication(id, context);

  if (application === null) {
    return { notFound: true };
  }

  return {
    props: {
      application,
      secured: true,
      requiredRoles: [Role.CPP_Manage],
    },
  };
};

export default ManagementEditApplicationPage;
