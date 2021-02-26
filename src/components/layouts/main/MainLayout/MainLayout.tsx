import ResponsiveHandler from '../../../ResponsiveHandler';
import GlobalFooter from '../GlobalFooter';
import GlobalHeader from '../GlobalHeader';

const MainLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <>
      <ResponsiveHandler />
      <GlobalHeader />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container">
        {children}
      </main>
      <GlobalFooter />
    </>
  );
};

export default MainLayout;
