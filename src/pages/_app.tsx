/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */
import { useEffect } from 'react';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getSession, Provider } from 'next-auth/client';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { DefaultSeo, NextSeo } from 'next-seo';
import { muiThemeConfig, nextSeoConfigEN, nextSeoConfigFR } from '../config';

const MyApp: NextPage<AppProps> = ({ Component, pageProps, router }) => {
  const { locale } = router;

  const defaultSeo = (locale?.toLowerCase() ?? 'en') === 'fr' ? nextSeoConfigFR : nextSeoConfigEN;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <Provider session={pageProps.session}>
      <DefaultSeo {...defaultSeo} />
      <NextSeo additionalMetaTags={[{ name: 'viewport', content: 'minimum-scale=1, initial-scale=1, width=device-width' }]} />
      <ThemeProvider theme={createMuiTheme(muiThemeConfig)}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

/**
 * See https://next-auth.js.org/tutorials/securing-pages-and-api-routes#server-side
 */
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: { session },
  };
};

export default MyApp;
