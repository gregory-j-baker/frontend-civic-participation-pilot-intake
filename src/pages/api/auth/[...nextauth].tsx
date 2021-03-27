/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { NextApiHandler } from 'next';
import type { User } from 'next-auth';
import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Provider } from 'next-auth/providers';
import Providers from 'next-auth/providers';

type OptionsBase = {
  [K in keyof Omit<Provider, 'id'>]?: Provider[K];
};

interface AzureADB2COptions extends OptionsBase {
  name?: string;
  clientId: string;
  clientSecret: string;
  idToken: boolean;
  tenantId: string;
}

interface JWTAccount extends Record<string, unknown> {
  accessToken?: string;
}

interface JWTUser extends User {
  roles?: string[];
}

type Profile = User & { id: string };

type UserOrToken = (User | JWT) & {
  accessToken?: string;
  roles?: string[];
};

const handler: NextApiHandler = (req, res) => {
  const options: AzureADB2COptions = {
    clientId: process.env.ESDC_AD_CLIENT_ID ?? '',
    clientSecret: process.env.ESDC_AD_CLIENT_SECRET ?? '',
    idToken: true,
    profile: (profile) => ({ ...profile, id: profile.oid as string } as Profile),
    scope: 'openid profile',
    tenantId: process.env.ESDC_AD_TENANT_ID ?? '',
  };

  return NextAuth(req, res, {
    providers: [Providers.AzureADB2C(options)],
    callbacks: {
      jwt: async (token, user: JWTUser, account: JWTAccount) => {
        return {
          ...token,
          ...(user?.roles && { roles: user.roles }),
          ...(account?.accessToken && { accessToken: account.accessToken }),
        };
      },
      session: async (session, userOrToken: UserOrToken) => {
        return {
          ...session,
          accessToken: userOrToken.accessToken,
          roles: userOrToken.roles,
        };
      },
    },
  });
};

export default handler;
