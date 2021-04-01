/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { applicationConfig } from '../../../config';
import { ButtonLink } from '../../../components/ButtonLink';

const EmailVerficationFailedPage: NextPage = () => {
  const { t, lang } = useTranslation();
  const { supportEmail } = applicationConfig;

  return (
    <MainLayout showAppTitle={false}>
      <NextSeo title={t('email-verification:failed.page.title')} />
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-16 tw-text-3xl">
            {t('email-verification:failed.page.header')}
          </h1>

          <p className="tw-mb-8">
            <Trans
              i18nKey="email-verification:failed.page.description"
              components={[
                <a key="support_email" href={`mailto:${supportEmail}`}>
                  {supportEmail}
                </a>,
              ]}
            />
          </p>

          <ButtonLink href={lang === 'fr' ? applicationConfig.canadaServiceCorpsUrl.fr : applicationConfig.canadaServiceCorpsUrl.en}>{t('email-verification:failed.form.submit')}</ButtonLink>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_cancel_u1it.svg" alt="" layout="fill" />
        </div>
      </div>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default EmailVerficationFailedPage;
