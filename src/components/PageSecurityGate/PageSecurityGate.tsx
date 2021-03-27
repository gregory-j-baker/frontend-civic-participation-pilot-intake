/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useSession, signIn } from 'next-auth/client';
import { Session } from 'next-auth';
import AccessDeniedPage from '../AccessDeniedPage/AccessDeniedPage';
import { Role } from '../../common/types';
import { exists } from 'node:fs';

export interface AADSession extends Session {
  roles?: string[];
}

export interface PageSecurityGateProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
  secured?: boolean;
}

export const PageSecurityGate = ({ children, requiredRoles, secured }: PageSecurityGateProps): JSX.Element => {
  const [session, loading] = useSession();

  if (typeof window !== 'undefined' && secured) {
    if (loading) {
      return <></>;
    }

    if (!session) {
      signIn();
      return <></>;
    }
    console.log(session);

    // validate roles
    if (requiredRoles && requiredRoles.length > 0) {
      const sessionRoles = (session as AADSession).roles;
      if (!sessionRoles || sessionRoles.length === 0) return <AccessDeniedPage />;
      if (sessionRoles.filter((role) => requiredRoles.map((r) => r as string).includes(role)).length === 0) {
        return <AccessDeniedPage />;
      }
    }
  }

  return <>{children}</>;
};
