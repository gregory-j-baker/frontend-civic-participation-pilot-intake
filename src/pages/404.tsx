import React from 'react';

const Custom404: React.FC = () => {
  return (
    <div className="tw-flex tw-flex-col tw-min-h-screen">
      <header>
        <div id="wb-bnr" className="container">
          <div className="row">
            <div className="brand col-xs-8 col-sm-9 col-md-6">
              <a href="https://www.canada.ca/content/canada.html">
                <img src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/sig-blk-en.svg" alt="Government of Canada / Gouvernement du Canada" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main property="mainContentOfPage" resource="#wb-main" className="container">
        <h1 id="wb-cont" className="wb-inv">
          Not Found
        </h1>
        <div className="row mrgn-tp-lg mrgn-bttm-lg">
          <div className="col-md-12">
            <div className="row">
              <section>
                <div className="col-md-6">
                  <div className="mwstext section">
                    <div className="row">
                      <div className="col-xs-3 col-sm-2 col-md-2 text-center mrgn-tp-md">
                        <span className="glyphicon glyphicon-warning-sign glyphicon-error"></span>
                      </div>
                      <div className="col-xs-9 col-sm-10 col-md-10">
                        <h2 className="mrgn-tp-md">We couldn&apos;t find that Web page</h2>
                        <p className="pagetag">
                          <b>Error 404</b>
                        </p>
                      </div>
                    </div>
                    <p>We&apos;re sorry you ended up here. Sometimes a page gets moved or deleted, but hopefully we can help you find what you&apos;re looking for. What next?</p>
                    <ul>
                      <li>
                        Return to the <a href="https://www.canada.ca/en.html">home page</a>;
                      </li>
                      <li>
                        Consult the <a href="https://www.canada.ca/en/sitemap.html">site map</a>;
                      </li>
                      <li>
                        <a href="https://www.canada.ca/en/contact.html">Contact us</a> and we&apos;ll help you out.
                      </li>
                    </ul>
                  </div>

                  <section className="col-md-12">
                    <h3 className="wb-inv">Search</h3>

                    <form action="https://recherche-search.gc.ca/rGs/s_r?#wb-land" method="get" name="cse-search-box" role="search" className="form-inline">
                      <div className="form-group">
                        <label htmlFor="wb-srch-q" className="wb-inv">
                          Search website
                        </label>
                        <input name="cdn" value="canada" type="hidden" />
                        <input name="st" value="s" type="hidden" />
                        <input name="num" value="10" type="hidden" />
                        <input name="langs" value="eng" type="hidden" />
                        <input name="st1rt" value="0" type="hidden" />
                        <input name="s5bm3ts21rch" value="x" type="hidden" />
                        <input type="hidden" name="_charset_" value="UTF-8" />
                        <input id="wb-srch-q" list="wb-srch-q-ac" className="wb-srch-q form-control" name="q" type="search" defaultValue="" size={27} maxLength={150} placeholder="Search Canada.ca" />
                        <datalist id="wb-srch-q-ac" />
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
              </section>
              <section lang="fr">
                <div className="col-md-6">
                  <div className="mwstext section">
                    <div className="row">
                      <div className="col-xs-3 col-sm-2 col-md-2 text-center mrgn-tp-md">
                        <span className="glyphicon glyphicon-warning-sign glyphicon-error"></span>
                      </div>
                      <div className="col-xs-9 col-sm-10 col-md-10">
                        <h2 className="mrgn-tp-md">Nous ne pouvons trouver cette page Web</h2>
                        <p className="pagetag">
                          <b>Erreur 404</b>
                        </p>
                      </div>
                    </div>
                    <p>Nous sommes désolés que vous ayez abouti ici. Il arrive parfois qu&apos;une page ait été déplacée ou supprimée. Heureusement, nous pouvons vous aider à trouver ce que vous cherchez. Que faire?</p>
                    <ul>
                      <li>
                        Retournez à la <a href="https://www.canada.ca/fr.html">page d&apos;accueil</a>;
                      </li>
                      <li>
                        Consultez le <a href="https://www.canada.ca/fr/plan.html">plan du site</a>;
                      </li>
                      <li>
                        <a href="https://www.canada.ca/fr/contact/index.html">Communiquez avec nous</a> pour obtenir de l&apos;aide.
                      </li>
                    </ul>
                  </div>

                  <section className="col-md-12">
                    <h3 className="wb-inv">Recherche</h3>

                    <form action="https://recherche-search.gc.ca/rGs/s_r?#wb-land" method="get" name="cse-search-box" role="search" className="form-inline">
                      <div className="form-group">
                        <label htmlFor="wb-srch-q" className="wb-inv">
                          Recherchez le site Web
                        </label>
                        <input name="cdn" value="canada" type="hidden" />
                        <input name="st" value="s" type="hidden" />
                        <input name="num" value="10" type="hidden" />
                        <input name="langs" value="fra" type="hidden" />
                        <input name="st1rt" value="0" type="hidden" />
                        <input name="s5bm3ts21rch" value="x" type="hidden" />
                        <input type="hidden" name="_charset_" value="UTF-8" />
                        <input id="wb-srch-q" list="wb-srch-q-ac" className="wb-srch-q form-control" name="q" type="search" defaultValue="" size={27} maxLength={150} placeholder="Rechercher dans Canada.ca" />
                        <datalist id="wb-srch-q-ac" />
                      </div>
                      <div className="form-group submit">
                        <button type="submit" id="wb-srch-sub" className="btn btn-primary btn-small" name="wb-srch-sub">
                          <span className="glyphicon-search glyphicon"></span>
                          <span className="wb-inv">Recherche</span>
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer role="contentinfo" id="wb-info" className="tw-mt-auto">
        <div className="brand">
          <div className="container">
            <div className="row">
              <div className="col-xs-6 visible-sm visible-xs tofpg">
                <a href="#wb-cont">
                  Top of page / <span lang="fr">Haut de la page</span> <span className="glyphicon glyphicon-chevron-up"></span>
                </a>
              </div>
              <div className="col-xs-6 col-md-12 text-right">
                <img src="https://www.canada.ca/etc/designs/canada/wet-boew/assets/wmms-blk.svg" alt="Symbol of the Government of Canada / Symbole du gouvernement du Canada" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Custom404;
