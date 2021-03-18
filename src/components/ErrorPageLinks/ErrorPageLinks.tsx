/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ListItemProps {
  children: React.ReactNode;
}

export interface ErrorPageLinksProps {
  lang: string;
}

export const ListItem = ({ children }: ListItemProps): JSX.Element => <li className="tw-my-2">{children}</li>;

export const ErrorPageLinks = ({ lang }: ErrorPageLinksProps): JSX.Element => {
  if (lang === 'fr') {
    return (
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
    );
  }

  return (
    <ul className="tw-list-disc tw-list-inside">
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
  );
};
