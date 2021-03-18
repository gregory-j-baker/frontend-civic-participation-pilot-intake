/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { NextPage } from 'next';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { applicationConfig } from '../../../config';
import { ButtonLink } from '../../../components/ButtonLink';

const ContactUsSuccess: NextPage = () => {
  const { t, lang } = useTranslation();

  return (
    <MainLayout showBreadcrumb={false}>
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <NextSeo title={t('contact-us:success.page.title')} />
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-16 tw-text-3xl">
            {t('contact-us:success.page.header')}
          </h1>
          <h2 className="tw-m-0 tw-border-none tw-mb-8 tw-text-2xl">{t('contact-us:success.page.sub-header')}</h2>
          <ButtonLink href={lang === 'fr' ? applicationConfig.canadaServiceCorpsUrl.fr : applicationConfig.canadaServiceCorpsUrl.en}>{t('contact-us:success.form.submit')}</ButtonLink>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_mobile_user_7oqo.svg" alt="" layout="fill" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUsSuccess;
