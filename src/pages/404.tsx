/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { MainLayout } from '../components/layouts/main/MainLayout';

interface ListItemProps {
  children: React.ReactNode;
}

const ListItem = ({ children }: ListItemProps): JSX.Element => <li className="tw-my-1">{children}</li>;

const Custom404 = (): JSX.Element => {
  const { t, lang } = useTranslation();
  return (
    <MainLayout showBreadcrumb={false}>
      <div className="tw-my-8">
        <div className="tw-flex">
          <div className="tw-w-24 tw-flex-shrink-0">
            <span className="glyphicon glyphicon-warning-sign glyphicon-error tw-flex-shrink-0"></span>
          </div>
          <div className="tw-flex-grow">
            <h1 className="tw-mt-0">{t('common:custom-404.header')}</h1>
            <p className="tw-m-0">
              <b>{t('common:custom-404.error-code')}</b>
            </p>
          </div>
        </div>

        <p className="tw-m-0 tw-my-4">{t('common:custom-404.description')}</p>

        {lang === 'fr' ? (
          <ul className="tw-list-disc tw-list-inside">
            <ListItem>
              Retournez à la <a href="https://www.canada.ca/fr.html">page d’accueil</a>;
            </ListItem>
            <ListItem>
              Consultez le <a href="https://www.canada.ca/fr/plan.html">plan du site</a>;
            </ListItem>
            <ListItem>
              <a href="https://www.canada.ca/fr/contact.html">Communiquez avec nous</a> pour obtenir de l’aide.
            </ListItem>
          </ul>
        ) : (
          <ul>
            <ListItem>
              Return to the <a href="https://www.canada.ca/en.html">home page</a>;
            </ListItem>
            <ListItem>
              Consult the <a href="https://www.canada.ca/en/sitemap.html">site map</a>; or
            </ListItem>
            <ListItem>
              <a href="https://www.canada.ca/en/contact.html">Contact us</a> and we&apos;ll help you out.
            </ListItem>
          </ul>
        )}
      </div>
    </MainLayout>
  );
};

export default Custom404;
