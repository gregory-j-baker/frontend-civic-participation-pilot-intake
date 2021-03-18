/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';

export const SkipToNav = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <nav>
      <ul id="wb-tphp">
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-cont">
            {t('layouts:main.header.skip-to-nav.main-content')}
          </a>
        </li>
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-info">
            {t('layouts:main.header.skip-to-nav.about-government')}
          </a>
        </li>
      </ul>
    </nav>
  );
};
