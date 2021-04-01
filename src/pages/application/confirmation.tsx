/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { ButtonLink } from '../../components/ButtonLink';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { applicationConfig } from '../../config';

const ApplicationConfirmationPage = (): JSX.Element => {
  const { t, lang } = useTranslation();

  return (
    <MainLayout>
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <NextSeo title={t('application:confirmation.title')} />

          <h2 className="tw-m-0 tw-border-none tw-mb-16 tw-text-2xl">{t('application:confirmation.sub-header')}</h2>
          <p className="tw-mb-16">{t('application:confirmation.instruction')}</p>

          <ButtonLink href={lang === 'fr' ? applicationConfig.canadaServiceCorpsUrl.fr : applicationConfig.canadaServiceCorpsUrl.en}>{t('application:confirmation.submit')}</ButtonLink>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_Mailbox_re_dvds.svg" alt="" layout="fill" />
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

export default ApplicationConfirmationPage;
