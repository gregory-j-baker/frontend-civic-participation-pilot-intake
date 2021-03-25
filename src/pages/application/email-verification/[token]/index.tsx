/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetServerSideProps, NextPage } from 'next';
import { MainLayout } from '../../../../components/layouts/main/MainLayout';
import { PageLoadingSpinner } from '../../../../components/PageLoadingSpinner';
import { apiConfig } from '../../../../config';
import { Params } from 'next/dist/next-server/server/router';

const EmailVerficationTokenPage: NextPage = () => {
  return (
    <MainLayout showBreadcrumb={false}>
      <PageLoadingSpinner />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }: Params) => {
  interface EmailVerificationTokenData {
    accessToken: string;
  }

  const emailVerificationTokenData: EmailVerificationTokenData = {
    accessToken: params.token,
  };

  const uri = `${apiConfig.baseUri}/email-validations/access-tokens`;

  const res = await fetch(uri, {
    body: JSON.stringify(emailVerificationTokenData),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!res.ok || !res.json) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: '/application/email-verification/success',
      permanent: true,
    },
  };
};

export default EmailVerficationTokenPage;
