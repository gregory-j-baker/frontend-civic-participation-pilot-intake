/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { ResponsiveHandler } from '../../ResponsiveHandler';
import { AppDetails } from './AppDetails';
import { GlobalFooter } from './GlobalFooter';
import { GlobalHeader } from './GlobalHeader';

export interface MainLayoutProps {
  children?: React.ReactNode;
  showAppTitle?: boolean;
}

export const MainLayout = ({ children, showAppTitle = true }: MainLayoutProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="tw-flex tw-flex-col tw-h-screen">
      <ResponsiveHandler />
      <GlobalHeader />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container tw-mb-auto tw-py-6 md:tw-py-8">
        {showAppTitle && (
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-8 tw-text-3xl">
            {t('common:app.title')}
          </h1>
        )}
        {children}
      </main>
      <AppDetails />
      <GlobalFooter />
    </div>
  );
};
