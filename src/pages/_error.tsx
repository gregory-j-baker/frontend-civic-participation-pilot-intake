/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextPage, NextPageContext } from 'next';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';
import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { ErrorPageLinks } from '../components/ErrorPageLinks';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { applicationConfig } from '../config';

export enum SourceEnum {
  Client,
  Server,
}

export interface ErrorProps {
  statusCode?: number;
  err?: Error | null;
  source?: SourceEnum;
}

const Error: NextPage<ErrorProps> = ({ statusCode, err, source }) => {
  const { appInsightsInstrumentationKey } = applicationConfig;
  const { locale } = useRouter();
  const { t } = useTranslation();

  const lang = locale ?? 'en';

  useEffect(() => {
    if (appInsightsInstrumentationKey) {
      const appInsightsWeb = new AppInsightsWeb({
        config: {
          instrumentationKey: appInsightsInstrumentationKey,
          /* ...Other Configuration Options... */
        },
      });

      appInsightsWeb.loadAppInsights();
      appInsightsWeb.trackException({ exception: err === null ? undefined : err, properties: { statusCode, source } });
    }
  }, [appInsightsInstrumentationKey, statusCode, err, source]);

  return (
    <div className="tw-flex tw-flex-col tw-h-screen">
      <NextSeo title={t('common:error.page-title')} />
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <div className="brand col-xs-12">
              <a href="https://canada.ca">
                <img src={`https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-${lang}.svg`} alt="" />
                <span className="wb-inv">{t('common:error.logo-title')}</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      <main role="main" property="mainContentOfPage" className="container tw-mb-auto" typeof="WebPageElement">
        <div className="tw-my-16 tw-flex tw-flex-col tw-space-y-4 tw-space-x-0 sm:tw-flex-row sm:tw-space-y-0 sm:tw-space-x-4 ">
          <section className="tw-w-full sm:tw-w-6/12">
            <ErrorMainContent lang={lang} />
          </section>
          <section className="tw-w-full sm:tw-w-6/12">
            <ErrorMainContent lang={lang === 'fr' ? 'en' : 'fr'} />
          </section>
        </div>
      </main>
      <footer id="wb-info">
        <div className="brand">
          <div className="container">
            <div className="row">
              <div className="col-xs-6 tofpg tw-visible md:tw-hidden">
                <a href="#wb-cont">
                  {lang === 'fr' ? (
                    <>
                      Haut de la page / <span lang="en">Top of page</span>
                      <span className="glyphicon glyphicon-chevron-up tw-ml-4"></span>
                    </>
                  ) : (
                    <>
                      Top of page / <span lang="fr">Haut de la page</span>
                    </>
                  )}
                  <span className="glyphicon glyphicon-chevron-up tw-ml-4"></span>
                </a>
              </div>
              <div className="col-xs-6 col-md-12 tw-text-right">
                <img className="tw-inline-block" src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" alt={t('common:error.footer-logo-title')} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res?.statusCode : err ? err.statusCode : 404;
  return { statusCode, err, source: SourceEnum.Server };
};

export interface ErrorMainContentProps {
  lang: string;
}

export const ErrorMainContent = ({ lang }: ErrorMainContentProps): JSX.Element => {
  return (
    <>
      <div className="tw-flex tw-items-center">
        <div className="tw-w-24 tw-flex-shrink-0">
          <span className="glyphicon glyphicon-warning-sign glyphicon-error tw-flex-shrink-0"></span>
        </div>
        <div className="tw-flex-grow">
          <h1 id="wb-cont" property="name" className="tw-m-0 tw-border-none">
            {lang === 'fr' ? 'Un problème est survenu' : 'A problem has occurred'}
          </h1>
        </div>
      </div>

      {lang === 'fr' ? (
        <>
          <p className="tw-m-0 tw-my-4">Nous éprouvons temporairement des difficultés d'ordre technique.</p>
          <p className="tw-m-0 tw-my-4">Veuillez réessayer plus tard. Nous nous excusons des inconvénients que cela peut vous avoir causer.</p>
        </>
      ) : (
        <>
          <p className="tw-m-0 tw-my-4">We are temporarily experiencing technical difficulties.</p>
          <p className="tw-m-0 tw-my-4">Please try again later. We apologize for any inconvenience.</p>
        </>
      )}
      <ErrorPageLinks lang={lang} />
    </>
  );
};

export default Error;
