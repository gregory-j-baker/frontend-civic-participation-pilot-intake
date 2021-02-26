const Menu: React.FC = () => {
  return (
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
  );
};

export default Menu;
