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
import { Language, Province } from '../../../hooks/api/code-lookups/types';

const ManagementApplicationsPage = (): JSX.Element => {
  const { lang } = useTranslation();
  const { data: applications, isLoading: isApplicationsLoading, error: applicationsError } = useApplications({});
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages({ lang });
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces({ lang });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);
  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  if (applicationsError || languagesError || provincesError) return <Error err={applicationsError ?? languagesError ?? provincesError} />;

  return (
    <MainLayout showBreadcrumb={false}>
      <h1 className="tw-m-0 tw-mb-10 tw-border-none">Management - Applications Listing here!</h1>
      {isApplicationsLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <div className="tw-flex tw-flex-col">
          <div className="tw--my-2 tw-overflow-x-auto sm:tw--mx-6 lg:tw--mx-8">
            <div className="tw-py-2 tw-align-middle tw-inline-block tw-min-w-full sm:tw-px-6 lg:tw-px-8">
              <div className="tw-shadow tw-overflow-hidden tw-border-b tw-border-gray-200 sm:tw-rounded-lg">
                <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
                  <thead className="tw-bg-gray-50">
                    <tr>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Province
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Date recived
                      </th>
                      <th scope="col" className="tw-px-4 tw-py-3 tw-text-left tw-text-xs font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="tw-relative tw-px-4 tw-py-3">
                        <span className="tw-sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
                    {applications?._embedded.applications.map((application) => (
                      <tr key={application.id}>
                        <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap">
                          <div className="tw-text-sm tw-font-medium tw-text-gray-900">{`${application.firstName} ${application.lastName}`}</div>
                          <div className="tw-text-sm tw-text-gray-500">{`${application.email}`}</div>
                        </td>
                        <td className="tw-px-4 tw-py-2 ">{languages && getDescription(languages._embedded.languages.find((obj) => obj.id === application.languageId) as Language)}</td>
                        <td className="tw-px-4 tw-py-2 ">{provinces && getDescription(provinces._embedded.provinces.find((obj) => obj.id === application.provinceId) as Province)}</td>
                        <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap">{dateTimeFormat.format(new Date(application.createdDate))}</td>
                        <td className="tw-px-4 tw-py-2 ">{application.applicationStatusId}</td>
                        <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap tw-text-right tw-text-sm tw-font-medium">
                          <Link href={`/management/applications/${application.id}`} passHref>
                            <a className="tw-text-indigo-600 hover:tw-text-indigo-900">Edit</a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
