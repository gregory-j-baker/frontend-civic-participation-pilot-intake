import Branding from './Branding';
import Breadcrumb from './Breadcrumb';
import LocaleSwitcher from './LocaleSwitcher';
import Menu from '../Menu';
import Search from './Search';
import SkipToNav from './SkipToNav';

interface GlobalHeaderProps {
  showBreadcrumb: boolean;
}

const GlobalHeader = ({ showBreadcrumb }: GlobalHeaderProps): JSX.Element => {
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
        {showBreadcrumb && <Breadcrumb />}
      </header>
    </div>
  );
};

export default GlobalHeader;
