/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { ErrorPageLinks } from './ErrorPageLinks';
import { MainLayout } from './layouts/main/MainLayout';

const AccessDeniedPage: React.FC = (): JSX.Element => {
  const { t, lang } = useTranslation();
  return (
    <MainLayout showAppTitle={false}>
      <NextSeo title={t('common:access-denied.page-title')} />

      <div className="tw-my-8">
        <div className="tw-flex">
          <div className="tw-w-24 tw-flex-shrink-0">
            <span className="glyphicon glyphicon-warning-sign glyphicon-error tw-flex-shrink-0"></span>
          </div>
          <div className="tw-flex-grow">
            <h1 id="wb-cont" className="tw-mt-0">
              {t('common:access-denied.header')}
            </h1>
            <p className="tw-m-0">
              <b>{t('common:access-denied.error-code')}</b>
            </p>
          </div>
        </div>

        <p className="tw-m-0 tw-my-4">{t('common:access-denied.description')}</p>

        <ErrorPageLinks lang={lang} />
      </div>
    </MainLayout>
  );
};

export default AccessDeniedPage;
