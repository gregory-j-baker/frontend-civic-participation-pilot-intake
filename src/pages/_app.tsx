/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getSession } from 'next-auth/client';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { muiThemeConfig } from '../config';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={createMuiTheme(muiThemeConfig)}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

/**
 * See https://next-auth.js.org/tutorials/securing-pages-and-api-routes#server-side
 */
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default MyApp;
