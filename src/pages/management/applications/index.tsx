/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useMemo } from 'react';
import { GetStaticProps } from 'next';
import { Role } from '../../../common/types';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { PageSecurityGateProps } from '../../../components/PageSecurityGate';
import { useApplications } from '../../../hooks/api/applications/useApplications';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { GetDescriptionFunc } from '../../application/types';
import useTranslation from 'next-translate/useTranslation';
import Error from '../../_error';
import Link from 'next/link';
import { ApplicationStatus, Language, Province } from '../../../hooks/api/code-lookups/types';
import { useApplicationStatuses } from '../../../hooks/api/code-lookups/useApplicationStatuses';
import { useRouter } from 'next/router';

interface RouterQuery {
  page?: number;
}

const ManagementApplicationsPage = (): JSX.Element => {
  const { lang } = useTranslation();

  const router = useRouter();
  const { page } = router.query as RouterQuery;

  const { data: applicationsResponse, isLoading: isApplicationsLoading, error: applicationsError } = useApplications({ page });

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading, error: applicationStatusesError } = useApplicationStatuses({});
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages({ lang });
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces({ lang });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);
  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  if (applicationsError || applicationStatusesError || languagesError || provincesError) {
    return <Error err={applicationsError ?? languagesError ?? provincesError ?? applicationStatusesError} />;
  }

  return (
    <MainLayout>
      <h1 className="tw-m-0 tw-mb-10 tw-border-none">Management - Applications Listing here!</h1>
      {isApplicationsLoading || isApplicationStatusesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <div className="tw-flex tw-flex-col">
          <div className="tw--my-2 tw-overflow-x-auto sm:tw--mx-6 lg:tw--mx-8">
            <div className="tw-py-2 tw-align-middle tw-inline-block tw-min-w-full sm:tw-px-6 lg:tw-px-8">
              <div className="tw-shadow tw-overflow-hidden tw-border-b tw-border-gray-200 sm:tw-rounded-lg">
                <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
                  <thead className="tw-bg-gray-50">
                    <tr>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Province
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Date recived
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="tw-relative tw-px-4 tw-py-3">
                        <span className="tw-sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  {applicationsResponse && (
                    <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
                      {applicationsResponse._embedded.applications.length > 0 ? (
                        applicationsResponse._embedded.applications.map((application) => (
                          <tr key={application.id}>
                            <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap">
                              <div className="tw-text-sm tw-font-bold tw-text-gray-900">{`${application.firstName} ${application.lastName}`}</div>
                              <div className="tw-text-sm tw-text-gray-500">{`${application.email}`}</div>
                            </td>
                            <td className="tw-px-4 tw-py-2 tw-text-sm">{languages && getDescription(languages._embedded.languages.find((obj) => obj.id === application.languageId) as Language)}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-sm">{provinces && getDescription(provinces._embedded.provinces.find((obj) => obj.id === application.provinceId) as Province)}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-sm tw-whitespace-nowrap">{dateTimeFormat.format(new Date(application.createdDate))}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-sm">{applicationStatuses && getDescription(applicationStatuses._embedded.applicationStatuses.find((obj) => obj.id === application.applicationStatusId) as ApplicationStatus)}</td>
                            <td className="tw-px-4 tw-py-2 tw-text-sm tw-whitespace-nowrap tw-text-right tw-font-bold">
                              <Link href={`/management/applications/${application.id}`} passHref>
                                <a className="tw-text-indigo-600 hover:tw-text-indigo-900">Edit</a>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="tw-px-4 tw-py-2 tw-text-sm tw-whitespace-nowrap tw-text-center" colSpan={7}>
                            No matching entries found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  )}
                </table>
                {applicationsResponse?.page && (
                  <div className="tw-bg-white tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200">
                    <div className="tw-hidden sm:tw-block">
                      <div className="tw-text-sm tw-text-gray-700 tw-hidden sm:tw-block">
                        Showing&nbsp;
                        <span className="tw-font-bold">{(applicationsResponse.page.number - 1) * applicationsResponse.page.size + 1}</span>
                        &nbsp;to&nbsp;
                        <span className="tw-font-bold">{applicationsResponse.page.number === applicationsResponse.page.totalPages ? applicationsResponse.page.totalElements : applicationsResponse.page.number * applicationsResponse.page.size}</span>
                        &nbsp;of&nbsp;
                        <span className="tw-font-bold">{applicationsResponse.page.totalElements}</span>
                        &nbsp;entries
                      </div>
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-between tw-space-x-4">
                      {applicationsResponse.page.number > 1 && (
                        <Link href={`/management/applications?page=${applicationsResponse.page.number - 1}`} passHref>
                          <a className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-bold tw-no-underline hover:tw-no-underline focus:tw-no-underline tw-rounded-md tw-text-gray-700 visited:tw-text-gray-700 tw-bg-white hover:tw-text-gray-500 focus:tw-text-gray-500">
                            Previous
                          </a>
                        </Link>
                      )}
                      {applicationsResponse.page.number < applicationsResponse.page.totalPages && (
                        <Link href={`/management/applications?page=${applicationsResponse.page.number + 1}`} passHref>
                          <a className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-bold tw-no-underline hover:tw-no-underline focus:tw-no-underline tw-rounded-md tw-text-gray-700 visited:tw-text-gray-700 tw-bg-white hover:tw-text-gray-500 focus:tw-text-gray-500">
                            Next
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      ...({ secured: true, requiredRoles: [Role.CPP_Manage] } as PageSecurityGateProps),
    },
  };
};

export default ManagementApplicationsPage;
