/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useSession, signIn } from 'next-auth/client';
import { Session } from 'next-auth';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';

export interface AADSession extends Session {
  roles?: string[];
}

export interface PageSecurityGateProps {
  children: React.ReactNode;
  secured?: boolean;
}

export const PageSecurityGate = ({ children, secured }: PageSecurityGateProps): JSX.Element => {
  const [session, loading] = useSession();

  if (typeof window !== 'undefined' && secured) {
    if (loading) {
      return <></>;
    }

    if (!session) {
      signIn();
      return <></>;
    }

    console.log((session as AADSession).roles?.includes('CivicParticipationProgram.Manage'));

    // validate roles
    if (((session as AADSession).roles?.includes('CivicParticipationProgram.Manage') ?? false) === false) {
      return <AccessDeniedPage />;
    }
  }

  return <>{children}</>;
};
