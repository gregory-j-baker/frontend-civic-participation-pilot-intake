/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextApiHandler } from 'next';
import NextAuth, { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Providers from 'next-auth/providers';

interface Account extends Record<string, unknown> {
  accessToken?: string;
}

type UserOrToken = (User | JWT) & {
  accessToken?: string;
};

const handler: NextApiHandler = (req, res) => {
  return NextAuth(req, res, {
    providers: [
      Providers.AzureADB2C({
        name: 'Canada Service Corps',

        clientId: process.env.ESDC_AD_CLIENT_ID ?? '',
        clientSecret: process.env.ESDC_AD_CLIENT_SECRET ?? '',

        accessTokenUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/token`,
        authorizationUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/authorize?response_type=code&response_mode=query`,

        scope: 'openid email profile api://civic-participation-management/manage',
      }),
    ],
    callbacks: {
      jwt: async (token, _user, account: Account) => {
        if (account?.accessToken) token.accessToken = account.accessToken;
        return token;
      },
      session: async (session, userOrToken: UserOrToken) => {
        return { ...session, accessToken: userOrToken?.accessToken };
      },
    },
  });
};
export default handler;
