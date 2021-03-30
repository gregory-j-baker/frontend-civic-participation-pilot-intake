/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Params } from 'next/dist/next-server/server/router';
import { Role } from '../../../common/types';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { PageSecurityGateProps } from '../../../components/PageSecurityGate';
import { ApplicationResponse, fetchApplication } from '../../../hooks/api/applications/useApplication';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { GetDescriptionFunc } from '../../application/types';
import useTranslation from 'next-translate/useTranslation';
import Error from '../../_error';
import { ApplicationStatus, Language, Province } from '../../../hooks/api/code-lookups/types';
import { useApplicationStatuses } from '../../../hooks/api/code-lookups/useApplicationStatuses';
import { getSession, signIn } from 'next-auth/client';
import { Application } from '../../../hooks/api/applications/types';
import { useDemographic } from '../../../hooks/api/code-lookups/useDemographic';
import { useDiscoveryChannel } from '../../../hooks/api/code-lookups/useDiscoveryChannel';
import { useEducationLevel } from '../../../hooks/api/code-lookups/useEducationLevel';
import { useGender } from '../../../hooks/api/code-lookups/useGender';
import { useLanguage } from '../../../hooks/api/code-lookups/useLanguage';
import { useProvince } from '../../../hooks/api/code-lookups/useProvince';
import { ApplicationReview, ApplicationReviewProps } from '../../../components/pages/ApplicationReview';

const ManagementEditApplicationPage: NextPage = ({ data }) => {
  const { lang } = useTranslation();

  console.log(data.id);

  const applicationReviewProps: ApplicationReviewProps = {
    firstName: data.firstName as string,
    lastName: data.lastName as string,
    email: data.email as string,
    phoneNumber: data.phoneNumber as string,
    birthYear: data.birthYear as number,
    languageId: data.languageId as string,
    isCanadianCitizen: data.isCanadianCitizen as boolean,
    provinceId: data.provinceId as string,
    discoveryChannelId: data.discoveryChannelId as string,
    genderId: data.genderId as string,
    educationLevelId: data.educationLevelId as string,
    demographicId: data.demographicId as string,
    skillsInterest: data.skillsInterest as string,
    communityInterest: data.communityInterest as string,
  };

  //const { data: applications, isLoading: isApplicationsLoading, error: applicationsError } = useApplications({});
  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading, error: applicationStatusesError } = useApplicationStatuses({});
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages({ lang });
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces({ lang });

  //const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);
  //const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // if (applicationsError || applicationStatusesError || languagesError || provincesError) {
  //   return <Error err={applicationsError ?? languagesError ?? provincesError ?? applicationStatusesError} />;
  // }

  return (
    <MainLayout>
      <h1 className="tw-m-0 tw-mb-10 tw-border-none">Applicant #123</h1>
      <h2 className="tw-border-none tw-m-0 tw-mb-4 tw-text-2xl">Firstname Lastname</h2>
      {isApplicationStatusesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <div className="tw-flex tw-flex-col">
          <div className="tw--my-2 tw-overflow-x-auto sm:tw--mx-6 lg:tw--mx-8">
            <div className="tw-py-2 tw-align-middle tw-inline-block tw-min-w-full sm:tw-px-6 lg:tw-px-8">
              <div className="tw-shadow tw-overflow-hidden tw-border-b tw-border-gray-200 sm:tw-rounded-lg">
                <div className="tw-mb-10">{<ApplicationReview {...applicationReviewProps} />}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) signIn();

  const accessToken = session?.accessToken;

  if (!accessToken) return { notFound: true };

  const application = await fetchApplication(context.params?.id as string, context);

  if (application === null) {
    return { notFound: true };
  }

  return {
    props: {
      data: { ...application },
      ...({ secured: true, requiredRoles: [Role.CPP_Manage] } as PageSecurityGateProps),
    },
  };
};

export default ManagementEditApplicationPage;
