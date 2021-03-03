import { FunctionComponent } from 'react';
import ResponsiveHandler from '../../../ResponsiveHandler';
import GlobalFooter from '../GlobalFooter';
import GlobalHeader from '../GlobalHeader';

interface MainLayoutProps extends FunctionComponent {
  children: React.ReactNode;
  showBreadcrumb: boolean;
}

const MainLayout = ({ children, showBreadcrumb }: MainLayoutProps): JSX.Element => (
  <div className="tw-flex tw-flex-col tw-min-h-screen">
    <ResponsiveHandler />
    <GlobalHeader showBreadcrumb={showBreadcrumb} />
    <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container">
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
