/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ResponsiveHandler } from '../../ResponsiveHandler';
import { GlobalFooter } from './GlobalFooter';
import { GlobalHeader } from './GlobalHeader';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps): JSX.Element => (
  <div className="tw-flex tw-flex-col tw-h-screen">
    <ResponsiveHandler />
    <GlobalHeader />
    <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container tw-mb-auto tw-py-6 md:tw-py-8">
      {children}
    </main>
    <GlobalFooter />
  </div>
);
