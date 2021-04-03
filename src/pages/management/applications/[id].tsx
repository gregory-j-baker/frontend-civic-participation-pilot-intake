/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useMemo, useState } from 'react';
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
import { Button } from '../../../components/Button';
import * as Yup from 'yup';

export interface ManagementEditApplicationPageState {
  applicationStatueId: string;
  reasoning?: string;
}

export interface ManagementEditApplicationPageProps {
  application: Application;
}

const ManagementEditApplicationPage = ({ application }: ManagementEditApplicationPageProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const [formState, setFormState] = useState<ManagementEditApplicationPageState>({ applicationStatueId: application.applicationStatusId });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading, error: applicationStatusesError } = useApplicationStatuses({ lang });
  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // application statuse options
  const applicationStatuseOptions = useMemo<SelectFieldOption[]>(() => {
    if (isApplicationStatusesLoading || applicationStatusesError) return [];
    return applicationStatuses?._embedded.applicationStatuses.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isApplicationStatusesLoading, applicationStatusesError, applicationStatuses, getDescription]);

  const canSubmit = application.applicationStatusId !== formState.applicationStatueId && Yup.string().defined().isValidSync(formState.reasoning);

  if (applicationStatusesError) {
    return <Error err={applicationStatusesError} />;
  }

  return (
    <MainLayout>
      <NextSeo title={t('application:management.edit.title')} />

      <h2 className="tw-m-0 tw-mb-8 tw-text-2xl">{t('application:management.edit.header')}</h2>

      <h3 className="tw-m-0 tw-mb-8 tw-text-xxl tw-text-gray-500">
        <span className="tw-block tw-mb-2">{`${application.firstName} ${application.lastName}`}</span>
        {dateTimeFormat.format(new Date(application.createdDate))}
      </h3>

      <ContentPaper className="tw-mb-10">
        <ApplicationReview application={application} />
      </ContentPaper>

      {!isApplicationStatusesLoading && (
        <ContentPaper>
          <SelectField
            field="status"
            label={t('application:management.edit.field.application-status')}
            value={formState.applicationStatueId}
            options={applicationStatuseOptions}
            onChange={({ value }) => setFormState((prev) => ({ ...prev, applicationStatueId: value as string }))}
            gutterBottom
            required
            className="tw-w-full sm:tw-w-6/12"
          />

          <TextAreaField
            field="status"
            label={t('application:management.edit.field.reasoning')}
            value={formState.reasoning}
            onChange={({ value }) => setFormState((prev) => ({ ...prev, reasoning: value ?? undefined }))}
            gutterBottom
            required
            className="tw-w-full"
          />

          <Button className="tw-m-2" disabled={!canSubmit}>
            {t('application:management.edit.submit')}
          </Button>
          <ButtonLink className="tw-m-2" href="/management/applications" outline>
            {t('application:management.edit.cancel')}
          </ButtonLink>
        </ContentPaper>
      )}
    </MainLayout>
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
