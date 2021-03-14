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
import Trans from 'next-translate/Trans';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import { MainLayout } from '../../../components/layouts/main/MainLayout';

const EmailVerficationSuccess: NextPage = () => {
  const { t } = useTranslation();

  const handleOnSubmit: ButtonOnClickEvent = (event) => {
    event.preventDefault();
  };

  return (
    <MainLayout showBreadcrumb={false}>
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <NextSeo title={t('email-verification:success.page.title')} />
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-16 tw-text-3xl">
            {t('email-verification:success.page.header')}
          </h1>
          <h2 className="tw-m-0 tw-border-none tw-mb-8 tw-text-2xl">{t('email-verification:success.page.sub-header')}</h2>
          <p className="tw-mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu nisi et dolor commodo convallis eu et turpis. Nam id eros tortor. Duis vestibulum magna justo.</p>
          <p className="tw-mb-16">Nunc a placerat libero, ac consequat ex. Donec molestie erat id gravida finibus. Cras nunc purus, accumsan vitae odio at, cursus ultrices arcu. Vestibulum eleifend ante ut justo laoreet, at bibendum odio tincidunt.</p>

          <Button onClick={handleOnSubmit}>{t('email-verification:success.form.submit')}</Button>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_winners_ao2o.svg" alt="" layout="fill" />
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailVerficationSuccess;