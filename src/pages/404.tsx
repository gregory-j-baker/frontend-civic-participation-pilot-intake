/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import MainLayout from '../components/layouts/main/MainLayout';

const Custom404 = (): JSX.Element => {
  const { t, lang } = useTranslation();
  return (
    <MainLayout showBreadcrumb={false}>
      <div className="mwstext section">
        <div className="row mrgn-tp-lg">
          <div className="col-xs-3 col-sm-2 col-md-1 text-center mrgn-tp-md">
            <span className="glyphicon glyphicon-warning-sign glyphicon-error"></span>
          </div>
          <div className="col-xs-9 col-sm-10 col-md-11">
            <h1 className="mrgn-tp-md">{t('common:custom-404.header')}</h1>
            <p className="pagetag">
              <b>{t('common:custom-404.error-code')}</b>
            </p>
          </div>
        </div>
        <div className="row mrgn-bttm-lg">
          <div className="col-md-12">
            <p>{t('common:custom-404.description')}</p>
            {lang === 'fr' ? (
              <ul>
                <li>
                  Retournez à la <a href="https://www.canada.ca/fr.html">page d’accueil</a>;
                </li>
                <li>
                  Consultez le <a href="https://www.canada.ca/fr/plan.html">plan du site</a>;
                </li>
                <li>
                  <a href="https://www.canada.ca/fr/contact.html">Communiquez avec nous</a> pour obtenir de l’aide.
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  Return to the <a href="https://www.canada.ca/en.html">home page</a>;
                </li>
                <li>
                  Consult the <a href="https://www.canada.ca/en/sitemap.html">site map</a>; or
                </li>
                <li>
                  <a href="https://www.canada.ca/en/contact.html">Contact us</a> and we&apos;ll help you out.
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Custom404;
