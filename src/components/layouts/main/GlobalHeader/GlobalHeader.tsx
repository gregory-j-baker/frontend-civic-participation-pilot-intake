import Branding from './Branding';
import Breadcrumb from './Breadcrumb';
import LocaleSwitcher from './LocaleSwitcher';
import Menu from './Menu';
import Search from './Search';
import SkipToNav from './SkipToNav';

const GlobalHeader: React.FC = () => {
  return (
    <div className="global-header">
      <SkipToNav />
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <LocaleSwitcher />
            <Branding />
            <Search />
          </div>
        </div>
        <Menu />
        <Breadcrumb />
      </header>
    </div>
  );
};

export default GlobalHeader;
