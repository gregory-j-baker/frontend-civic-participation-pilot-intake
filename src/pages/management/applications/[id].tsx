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

const ManagementEditApplicationPage: NextPage = (props) => {
  const { lang } = useTranslation();

  console.log(props);

  // const applicationReviewProps: ApplicationReviewProps = {
  //   firstName: props.firstName as string,
  //   lastName: props.lastName as string,
  //   email: props.email as string,
  //   phoneNumber: props.phoneNumber as string,
  //   birthYear: props.birthYear as number,
  //   languageId: props.languageId as string,
  //   isCanadianCitizen: props.isCanadianCitizen as boolean,
  //   provinceId: props.provinceId as string,
  //   discoveryChannelId: props.discoveryChannelId as string,
  //   genderId: props.genderId as string,
  //   educationLevelId: props.educationLevelId as string,
  //   demographicId: props.demographicId as string,
  //   skillsInterest: props.skillsInterest as string,
  //   communityInterest: props.communityInterest as string,
  // };

  const applicationReviewProps: ApplicationReviewProps = {
    firstName: 'first name',
    lastName: 'last name',
    email: 'email',
    phoneNumber: 'phone',
    birthYear: 1979,
    languageId: '2b05e0d0-995c-4267-ba29-4fa2d3f00199',
    isCanadianCitizen: true,
    provinceId: 'e09b7ca2-1664-4dd2-9aa3-6de3d28d6606',
    discoveryChannelId: '77057e6f-6267-4459-8599-8b0796724d8f',
    genderId: '8be28fb2-f5be-44fc-a01b-5dd6ebf64ab8',
    educationLevelId: '8d47ccef-4908-4866-8e35-bb90792005e6',
    demographicId: '808b164a-86d4-11eb-8dcd-0242ac130003',
    skillsInterest: 'skills',
    communityInterest: 'community',
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
