import GlobalFooter from '../GlobalFooter';
import GlobalHeader from '../GlobalHeader';

const MainLayout: React.FC = ({ children }): JSX.Element => {
  return (
    <>
      <GlobalHeader />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container">
        {children}
      </main>
      <GlobalFooter />
    </>
  );
};

export default MainLayout;
