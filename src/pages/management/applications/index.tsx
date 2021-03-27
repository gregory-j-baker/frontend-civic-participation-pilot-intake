/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetStaticProps } from 'next';
import { Role } from '../../../common/types';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { PageSecurityGateProps } from '../../../components/PageSecurityGate';
import { useApplications } from '../../../hooks/api/applications/useApplications';
import Error from '../../_error';

const ManagementApplicationsPage = (): JSX.Element => {
  const { data: applications, isLoading: isApplicationsLoading, error: applicationsError } = useApplications({});

  if (applicationsError) return <Error err={applicationsError} />;

  return (
    <MainLayout showBreadcrumb={false}>
      <h1 className="tw-m-0 tw-mb-10 tw-border-none">Management - Applications Listing here!</h1>
      {isApplicationsLoading ? <PageLoadingSpinner /> : <>{JSON.stringify(applications)}</>}
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
