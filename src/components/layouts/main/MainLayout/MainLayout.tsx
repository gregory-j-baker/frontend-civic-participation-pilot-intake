import ResponsiveHandler from '../../../ResponsiveHandler';
import GlobalFooter from '../GlobalFooter';
import GlobalHeader from '../GlobalHeader';

const MainLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <div className="tw-flex tw-flex-col tw-min-h-screen">
      <ResponsiveHandler />
      <GlobalHeader />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container">
        {children}
      </main>
      <div className="tw-mt-auto">
        <GlobalFooter />
      </div>
    </div>
  );
};

export default MainLayout;
