/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import type { NextApiHandler } from 'next';
import type { User } from 'next-auth';
import NextAuth from 'next-auth';
import type { GenericObject, SessionBase } from 'next-auth/_utils';

interface AzureActiveDirectoryProvider {
  oid: string;
}

interface SessionUser extends User {
  accessToken?: string;
}

const handler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      {
        id: 'canada-service-corps',
        name: 'Canada Service Corps',
        clientId: process.env.ESDC_AD_CLIENT_ID,
        clientSecret: process.env.ESDC_AD_CLIENT_SECRET,

        type: 'oauth',
        version: '2.0',
        scope: 'openid email profile offline_access',
        idToken: true,

        accessTokenUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/token`,
        authorizationUrl: `https://login.microsoftonline.com/${process.env.ESDC_AD_TENANT_ID}/oauth2/v2.0/authorize`,
        profileUrl: 'https://graph.microsoft.com/v1.0/me/',

        authorizationParams: { response_mode: 'query', response_type: 'code' },
        params: { grant_type: 'authorization_code' },

        profile: (profile: AzureActiveDirectoryProvider) => {
          return { ...profile, id: profile.oid };
        },
      },
    ],
    callbacks: {
      jwt: async (token: GenericObject, _user: User, account: GenericObject, _profile: GenericObject, _isNewUser: boolean) => {
        if (account?.accessToken) token.accessToken = account.accessToken;
        return token;
      },
      session: async (session: SessionBase, user: SessionUser) => {
        if (user?.accessToken) session.accessToken = user.accessToken;
        return session;
      },
    },
  });

export default handler;
