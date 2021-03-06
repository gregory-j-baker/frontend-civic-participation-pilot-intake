/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FunctionComponent } from 'react';
import { ResponsiveHandler } from '../../../ResponsiveHandler';
import { GlobalFooter } from '../GlobalFooter';
import { GlobalHeader } from '../GlobalHeader';

interface MainLayoutProps extends FunctionComponent {
  children: React.ReactNode;
  showBreadcrumb: boolean;
}

const MainLayout = ({ children, showBreadcrumb }: MainLayoutProps): JSX.Element => (
  <div className="tw-flex tw-flex-col tw-min-h-screen">
    <ResponsiveHandler />
    <GlobalHeader showBreadcrumb={showBreadcrumb} />
    <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container tw-py-6 md:tw-py-8">
      {children}
    </main>
    <div className="tw-mt-auto">
      <GlobalFooter />
    </div>
  </div>
);

MainLayout.defaultProps = {
  showBreadcrumb: true,
};

export default MainLayout;
