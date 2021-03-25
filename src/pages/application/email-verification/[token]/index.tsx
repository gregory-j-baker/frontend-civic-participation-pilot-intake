/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetServerSideProps, NextPage } from 'next';
import { apiConfig } from '../../../../config';
import { Params } from 'next/dist/next-server/server/router';

interface EmailVerificationTokenData {
  accessToken: string;
}

const EmailVerficationTokenPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: Params) => {
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
