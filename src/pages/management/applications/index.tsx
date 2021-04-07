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
import { PageSecurityGate } from '../../../components/PageSecurityGate';
import { useApplications } from '../../../hooks/api/applications/useApplications';
import { useLanguages } from '../../../hooks/api/code-lookups/useLanguages';
import { useProvinces } from '../../../hooks/api/code-lookups/useProvinces';
import { GetDescriptionFunc } from '../../application/types';
import useTranslation from 'next-translate/useTranslation';
import Error from '../../_error';
import Link from 'next/link';
import { ApplicationStatus, ApplicationStatusEnum, Language, Province } from '../../../hooks/api/code-lookups/types';
import { useApplicationStatuses } from '../../../hooks/api/code-lookups/useApplicationStatuses';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { SelectField, SelectFieldOption } from '../../../components/form/SelectField';
import { TableWrapper } from '../../../components/table/TableWrapper';
import { Table } from '../../../components/table/Table';
import { TableHead } from '../../../components/table/TableHead';
import { TableBody } from '../../../components/table/TableBody';
import { TableHeadCell } from '../../../components/table/TableHeadCell';
import { TableCell } from '../../../components/table/TableCell';
import { TableRowNoData } from '../../../components/table/TableRowNoData';
import { TablePagination } from '../../../components/table/TablePagination';

interface RouterQuery {
  page?: number;
  status?: string;
}

const ManagementApplicationsPage = (): JSX.Element => {
  const { t, lang } = useTranslation();

  const router = useRouter();
  const { query, pathname } = router;
  const { page, status } = query as RouterQuery;

  const { data: applicationsResponse, isLoading: isApplicationsLoading, error: applicationsError } = useApplications({ page, applicationStatusId: status ?? ApplicationStatusEnum.NEW });

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading, error: applicationStatusesError } = useApplicationStatuses({ lang });
  const { data: languages, isLoading: isLanguagesLoading, error: languagesError } = useLanguages();
  const { data: provinces, isLoading: isProvincesLoading, error: provincesError } = useProvinces();

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);
  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  // application statuse options
  const applicationStatuseOptions = useMemo<SelectFieldOption[]>(() => {
    if (isApplicationStatusesLoading || applicationStatusesError) return [];
    return applicationStatuses?._embedded.applicationStatuses.map((el) => ({ value: el.id, text: getDescription(el) })) ?? [];
  }, [isApplicationStatusesLoading, applicationStatusesError, applicationStatuses, getDescription]);

  if (applicationsError || applicationStatusesError || languagesError || provincesError) {
    return <Error err={applicationsError ?? languagesError ?? provincesError ?? applicationStatusesError} />;
  }

  return (
    <MainLayout>
      {isApplicationsLoading || isApplicationStatusesLoading || isLanguagesLoading || isProvincesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={t('application:management.list.title')} />

          <h2 className="tw-m-0 tw-mb-8 tw-text-2xl">{t('application:management.list.header')}</h2>

          <SelectField
            field="status"
            label={t('application:management.list.filter-by')}
            value={status ?? ApplicationStatusEnum.NEW}
            options={applicationStatuseOptions}
            onChange={({ value }) => router.push({ pathname, query: { ...query, status: value } })}
            gutterBottom
            className="tw-w-full sm:tw-w-6/12"
          />

          <TableWrapper>
            <Table>
              <TableHead>
                <tr>
                  <TableHeadCell>{t('application:management.list.table-header.name')}</TableHeadCell>
                  <TableHeadCell>{t('application:management.list.table-header.language')}</TableHeadCell>
                  <TableHeadCell>{t('application:management.list.table-header.province')}</TableHeadCell>
                  <TableHeadCell>{t('application:management.list.table-header.date-received')}</TableHeadCell>
                  <TableHeadCell>{t('application:management.list.table-header.status')}</TableHeadCell>
                  <TableHeadCell>{t('application:management.list.table-header.is-email-validated')}</TableHeadCell>
                  <TableHeadCell>
                    <span className="tw-sr-only">{t('application:management.list.table-header.edit')}</span>
                  </TableHeadCell>
                </tr>
              </TableHead>
              {applicationsResponse && (
                <TableBody>
                  {applicationsResponse._embedded.applications.length > 0 ? (
                    applicationsResponse._embedded.applications.map((application) => (
                      <tr key={application.id}>
                        <TableCell className="tw-px-4 tw-py-2 tw-whitespace-nowrap">
                          <div className="tw-text-sm tw-font-bold tw-text-gray-900">{`${application.firstName} ${application.lastName}`}</div>
                          <div className="tw-text-sm tw-text-gray-500">{`${application.email}`}</div>
                        </TableCell>
                        <TableCell>{languages && getDescription(languages._embedded.languages.find((obj) => obj.id === application.languageId) as Language)}</TableCell>
                        <TableCell>{provinces && getDescription(provinces._embedded.provinces.find((obj) => obj.id === application.provinceId) as Province)}</TableCell>
                        <TableCell className="tw-whitespace-nowrap">{dateTimeFormat.format(new Date(application.createdDate))}</TableCell>
                        <TableCell>{applicationStatuses && getDescription(applicationStatuses._embedded.applicationStatuses.find((obj) => obj.id === application.applicationStatusId) as ApplicationStatus)}</TableCell>
                        <TableCell>{application.isEmailValidated ? t('common:yes') : t('common:no')}</TableCell>
                        <TableCell className="tw-whitespace-nowrap tw-text-right tw-font-bold">
                          <Link href={`/management/applications/${application.id}`} passHref>
                            <a className="tw-text-indigo-600 hover:tw-text-indigo-900">{t('application:management.list.edit-link')}</a>
                          </Link>
                        </TableCell>
                      </tr>
                    ))
                  ) : (
                    <TableRowNoData colSpan={8} />
                  )}
                </TableBody>
              )}
            </Table>
            {applicationsResponse?.page && <TablePagination page={applicationsResponse.page} />}
          </TableWrapper>
        </>
      )}
    </MainLayout>
  );
};

const SecuredPage = (): JSX.Element => {
  return (
    <PageSecurityGate requiredRoles={[Role.CPP_Manage]}>
      <ManagementApplicationsPage />
    </PageSecurityGate>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default SecuredPage;
