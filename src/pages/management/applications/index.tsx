/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetStaticProps } from 'next';
import { MainLayout } from '../../../components/layouts/main/MainLayout';

const ManagementApplicationsPage = (): JSX.Element => {
  return (
    <MainLayout showBreadcrumb={false}>
      <h1>Management - Applications Listing here!</h1>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      secured: true,
    },
  };
};

export default ManagementApplicationsPage;