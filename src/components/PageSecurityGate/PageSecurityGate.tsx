/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useSession, signIn } from 'next-auth/client';
import jwt_decode from 'jwt-decode';
// import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';

export interface PageSecurityGateProps {
  children: React.ReactNode;
  secured?: boolean;
}

export const PageSecurityGate = ({ children, secured }: PageSecurityGateProps): JSX.Element => {
  const [session, loading] = useSession();

  console.log({ session, loading });

  if (secured) {
    if (loading) {
      return <></>;
    }

    if (!session) {
      signIn();
      return <></>;
    }

    // validate roles
    if (session.accessToken) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const jwtDecoded = jwt_decode(session.accessToken ?? '');
      console.log(jwtDecoded);
      //return <AccessDeniedPage />;
    }
  }

  return <>{children}</>;
};
