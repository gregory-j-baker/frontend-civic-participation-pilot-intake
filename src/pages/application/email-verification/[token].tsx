/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetServerSideProps } from 'next';
import { Params } from 'next/dist/next-server/server/router';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { NextSeo } from 'next-seo';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import Image from 'next/image';
import Custom404 from '../../404';
import { useSubmitAccessToken } from '../../../hooks/api/email-verifications/useSubmitAccessToken';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import Error from '../../_error';

interface EmailVerificationTokenData {
  accessToken: string;
}

export interface EmailVerficationTokenPageProps {
  accessToken: string;
}

const EmailVerficationTokenPage = ({ accessToken }: EmailVerficationTokenPageProps): JSX.Element => {
  const { t } = useTranslation('email-verification');
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const { mutate: submitAccessToken, error: submitAccessTokenError, isLoading: submitAccessTokenIsLoading, isSuccess: submitAccessTokenIsSuccess } = useSubmitAccessToken({
    onSuccess: () => {
      router.push('/application/email-verification/success');
    },
  });

  const handleOnSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    // submit email verification form
    const emailVerificationTokenData: EmailVerificationTokenData = {
      accessToken: accessToken,
    };

    submitAccessToken(emailVerificationTokenData);
  };

  useEffect(() => {
    setPageLoading(false);
  }, []);

  if (submitAccessTokenError) {
    return <Error err={submitAccessTokenError as HttpClientResponseError} />;
  }

  if (!pageLoading && !accessToken) return <Custom404 />;

  return (
    <MainLayout showAppTitle={false}>
      <NextSeo title={t('email-verification:token.page.title')} />
      {pageLoading ? (
        <PageLoadingSpinner />
      ) : (
        <div className="tw-flex tw-space-x-10">
          <div className="tw-w-full md:tw-w-1/2">
            <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
              {t('email-verification:token.page.header')}
            </h1>
            <p className="tw-m-0 tw-mb-4">{t('email-verification:token.page.description')}</p>

            <div className="tw-flex tw-flex-wrap">
              <Button onClick={handleOnSubmit} disabled={submitAccessTokenIsLoading || submitAccessTokenIsSuccess} className="tw-m-2">
                {t('email-verification:token.page.submit')}
              </Button>
            </div>
          </div>
          <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
            <Image src="/img/undraw_authentication_fsn5.svg" alt="" layout="fill" />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }: Params) => {
  return {
    props: {
      accessToken: params.token,
    },
  };
};

export default EmailVerficationTokenPage;
