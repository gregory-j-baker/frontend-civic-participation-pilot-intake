/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextApiHandler } from 'next';
import NextAuth, { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Providers, { Provider } from 'next-auth/providers';

type OptionsBase = {
  [K in keyof Omit<Provider, 'id'>]?: Provider[K];
};

interface AzureADB2COptions extends OptionsBase {
  name?: string;
  clientId: string;
  clientSecret: string;
  idToken?: boolean;
}

interface JTWAccount extends Record<string, unknown> {
  accessToken?: string;
  idToken?: string;
}

interface JTWUser extends User {
  roles?: string[];
}

type Profile = User & { id: string };

type UserOrToken = (User | JWT) & {
  accessToken?: string;
  roles?: string[];
};

const handler: NextApiHandler = (req, res) => {
  const options: AzureADB2COptions = {
    name: 'Canada Service Corps',

    clientId: process.env.ESDC_AD_CLIENT_ID ?? '',
    clientSecret: process.env.ESDC_AD_CLIENT_SECRET ?? '',

    accessTokenUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/token`,
    authorizationUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/authorize?response_type=code&response_mode=query&id_token=true`,

    scope: 'openid email profile',

    idToken: true,

    profile: (profile) => {
      return { ...profile, id: profile.oid as string } as Profile;
    },
  };

  return NextAuth(req, res, {
    providers: [Providers.AzureADB2C(options)],
    callbacks: {
      jwt: async (token, user: JTWUser, account: JTWAccount) => {
        if (user?.roles) token.roles = user.roles;
        if (account?.idToken) token.accessToken = account.idToken;
        return token;
      },
      session: async (session, userOrToken: UserOrToken) => {
        return { ...session, accessToken: userOrToken.accessToken, roles: userOrToken.roles };
      },
    },
  });
};
export default handler;
