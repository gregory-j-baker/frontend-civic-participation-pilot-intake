/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { AppProps } from 'next/app';
import { DefaultSeo, NextSeo } from 'next-seo';
import { nextSeoConfigEN, nextSeoConfigFR } from '../config';
import { Provider } from 'next-auth/client';
import AppInsightsPageViewTracking from '../components/AppInsightsPageViewTracking';

import '../styles/globals.css';

const MyApp = (props: AppProps): JSX.Element => {
  const { Component, pageProps, router } = props;
  const { locale } = router;

  const defaultSeo = (locale?.toLowerCase() ?? 'en') === 'fr' ? nextSeoConfigFR : nextSeoConfigEN;

  return (
    <Provider session={pageProps.session}>
      <DefaultSeo {...defaultSeo} />
      <NextSeo additionalMetaTags={[{ name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width' }]} />
      <Component {...pageProps} />
      <AppInsightsPageViewTracking />
    </Provider>
  );
};

export default MyApp;
