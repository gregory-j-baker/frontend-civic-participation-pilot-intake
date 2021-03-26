/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DefaultSeo, NextSeo } from 'next-seo';
import { AppProps } from 'next/app';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { AppInsightsPageViewTracking } from '../components/AppInsightsPageViewTracking';
import { PageSecurityGate } from '../components/PageSecurityGate';
import { nextSeoConfigEN, nextSeoConfigFR } from '../config';

import '../styles/globals.css';
import '../styles/wet-boew.css';

const queryClient = new QueryClient();

const MyApp = (props: AppProps): JSX.Element => {
  const { Component, pageProps, router } = props;
  const { locale } = router;

  const defaultSeo = (locale?.toLowerCase() ?? 'en') === 'fr' ? nextSeoConfigFR : nextSeoConfigEN;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <DefaultSeo {...defaultSeo} />
        <NextSeo additionalMetaTags={[{ name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width' }]} />
        <PageSecurityGate {...pageProps}>
          <Component {...pageProps} />
        </PageSecurityGate>
        <AppInsightsPageViewTracking />
      </Hydrate>
    </QueryClientProvider>
  );
};

export default MyApp;
