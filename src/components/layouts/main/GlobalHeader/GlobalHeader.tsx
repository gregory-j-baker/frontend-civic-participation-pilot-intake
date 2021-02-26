// import useTranslation from 'next-translate/useTranslation';

import LocaleSwitcher from '../LocaleSwitcher';

const GlobalHeader: React.FC = () => {
  // const { t, lang } = useTranslation();

  return (
    <div className="global-header">
      <nav>
        <ul id="wb-tphp">
          <li className="wb-slc">
            <a className="wb-sl" href="#wb-cont">
              Skip to main content
            </a>
          </li>
          <li className="wb-slc">
            <a className="wb-sl" href="#wb-info">
              Skip to &#34;About government&#34;
            </a>
          </li>
        </ul>
      </nav>

      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <LocaleSwitcher />
            <div className="brand col-xs-9 col-sm-5 col-md-4" property="publisher" typeof="GovernmentOrganization">
              <link href="https://www.canada.ca/content/canadasite/en.html" property="url" />

              <img src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg" alt="Government of Canada" property="logo" />
              <span className="wb-inv">
                {' '}
                /<span lang="fr">Gouvernement du Canada</span>
              </span>

              <meta property="name" content="Government of Canada" />
              <meta property="areaServed" typeof="Country" content="Canada" />
              <link property="logo" href="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" />
            </div>

            <section id="wb-srch" className="col-lg-offset-4 col-md-offset-4 col-sm-offset-2 col-xs-12 col-sm-5 col-md-4">
              <h2>Search</h2>

              <form action="https://www.canada.ca/en/sr/srb.html" method="get" name="cse-search-box" role="search">
                <div className="form-group wb-srch-qry">
                  <label htmlFor="wb-srch-q" className="wb-inv">
                    Search Canada.ca
                  </label>
                  <input name="cdn" value="canada" type="hidden" readOnly />
                  <input name="st" value="s" type="hidden" readOnly />
                  <input name="num" value="10" type="hidden" readOnly />
                  <input name="langs" value="en" type="hidden" readOnly />
                  <input name="st1rt" value="1" type="hidden" readOnly />
                  <input name="s5bm3ts21rch" value="x" type="hidden" readOnly />

                  <input id="wb-srch-q" list="wb-srch-q-ac" className="wb-srch-q form-control" name="q" type="search" size={34} maxLength={170} placeholder="Search Canada.ca" defaultValue="" />

                  <input type="hidden" name="_charset_" value="UTF-8" readOnly />

                  <datalist id="wb-srch-q-ac"></datalist>
                </div>
                <div className="form-group submit">
                  <button type="submit" id="wb-srch-sub" className="btn btn-primary btn-small" name="wb-srch-sub">
                    <span className="glyphicon-search glyphicon"></span>
                    <span className="wb-inv">Search</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
        <nav className="gcweb-v2 gcweb-menu" typeof="SiteNavigationElement">
          <div className="container">
            <h2 className="wb-inv">Menu</h2>
            <button type="button" aria-haspopup="true" aria-expanded="false">
              <span className="wb-inv">Main </span>Menu <span className="expicon glyphicon glyphicon-chevron-down"></span>
            </button>
            <ul role="menu" aria-orientation="vertical" data-ajax-replace="/content/dam/canada/sitemenu/sitemenu-v2-en.html">
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/jobs.html">
                  Jobs and the workplace
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/immigration-citizenship.html">
                  Immigration and citizenship
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://travel.gc.ca/">
                  Travel and tourism
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/business.html">
                  Business and industry
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/benefits.html">
                  Benefits
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/health.html">
                  Health
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/taxes.html">
                  Taxes
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/environment.html">
                  Environment and natural resources
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/defence.html">
                  National security and defence
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/culture.html">
                  Culture, history and sport
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/policing.html">
                  Policing, justice and emergencies
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/transport.html">
                  Transport and infrastructure
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="http://international.gc.ca/world-monde/index.aspx?lang=eng">
                  Canada and the world
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/finance.html">
                  Money and finances
                </a>
              </li>
              <li role="presentation">
                <a role="menuitem" tabIndex={-1} href="https://www.canada.ca/en/services/science.html">
                  Science and innovation
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <nav id="wb-bc" property="breadcrumb">
          <h2 className="wb-inv">You are here:</h2>
          <div className="container">
            <ol className="breadcrumb">
              <li>
                <a href="https://www.canada.ca/en.html">Canada.ca</a>
              </li>
              <li>
                <a href="https://www.canada.ca/en/services/benefits.html">Benefits</a>
              </li>
            </ol>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default GlobalHeader;
