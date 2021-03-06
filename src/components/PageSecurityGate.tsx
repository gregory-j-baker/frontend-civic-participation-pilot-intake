/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useSession, signIn } from 'next-auth/client';
import AccessDeniedPage from './AccessDeniedPage';
import { AADSession, Role } from '../common/types';
import { MainLayout } from './layouts/main/MainLayout';
import { PageLoadingSpinner } from './PageLoadingSpinner';

export interface PageSecurityGateProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

export const PageSecurityGate = ({ children, requiredRoles }: PageSecurityGateProps): JSX.Element => {
  const [session, loading] = useSession();

  if (loading) {
    return (
      <MainLayout>
        <PageLoadingSpinner />
      </MainLayout>
    );
  }

  if (!session || Date.now() >= (session as AADSession).accessTokenExpires || !session.accessToken) {
    signIn('azure-ad-b2c');
    return (
      <MainLayout>
        <PageLoadingSpinner />
      </MainLayout>
    );
  }

  // validate roles
  if (requiredRoles && requiredRoles.length > 0) {
    const sessionRoles = (session as AADSession).roles;
    if (!sessionRoles || sessionRoles.length === 0) return <AccessDeniedPage />;
    if (sessionRoles.filter((role) => requiredRoles.map((r) => r as string).includes(role)).length === 0) return <AccessDeniedPage />;
  }

  return <>{children}</>;
};
