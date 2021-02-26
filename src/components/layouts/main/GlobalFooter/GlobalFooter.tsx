// import useTranslation from 'next-translate/useTranslation';

const GlobalFooter: React.FC = () => {
  // const { t, lang } = useTranslation();

  return (
    <div className="global-footer">
      <footer id="wb-info">
        <div className="landscape">
          <nav className="container wb-navcurr">
            <h2 className="wb-inv">About government</h2>
            <ul className="list-unstyled colcount-sm-2 colcount-md-3">
              <li>
                <a href="https://www.canada.ca/en/employment-social-development/corporate/contact/ei-individual.html">Contact Employment Insurance</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/government/dept.html">Departments and agencies</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/government/publicservice.html">Public service and military</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/news.html">News</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/government/system/laws.html">Treaties, laws and regulations</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/transparency/reporting.html">Government-wide reporting</a>
              </li>

              <li>
                <a href="http://pm.gc.ca/en">Prime Minister</a>
              </li>

              <li>
                <a href="https://www.canada.ca/en/government/system.html">About government</a>
              </li>

              <li>
                <a href="http://open.canada.ca/en">Open government</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="brand">
          <div className="container">
            <div className="row">
              <nav className="col-md-10 ftr-urlt-lnk">
                <h2 className="wb-inv">About this site</h2>
                <ul>
                  <li>
                    <a href="https://www.canada.ca/en/social.html">Social media</a>
                  </li>

                  <li>
                    <a href="https://www.canada.ca/en/mobile.html">Mobile applications</a>
                  </li>

                  <li>
                    <a href="https://www.canada.ca/en/government/about.html">About Canada.ca</a>
                  </li>

                  <li>
                    <a href="https://www.canada.ca/en/transparency/terms.html">Terms and conditions</a>
                  </li>

                  <li>
                    <a href="https://www.canada.ca/en/transparency/privacy.html">Privacy</a>
                  </li>
                </ul>
              </nav>
              <div className="col-xs-6 visible-sm visible-xs tofpg">
                <a href="#wb-cont">
                  Top of page <span className="glyphicon glyphicon-chevron-up"></span>
                </a>
              </div>
              <div className="col-xs-6 col-md-2 text-right">
                <img src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" alt="Symbol of the Government of Canada" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GlobalFooter;
