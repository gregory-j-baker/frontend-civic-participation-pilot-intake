/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';

export const Breadcrumb = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <nav id="wb-bc" property="breadcrumb">
      <h2 className="wb-inv">{t('layouts:main.header.breadcrumb.header')}</h2>
      <div className="container">
        <ol className="breadcrumb">
          <li>
            <a href={t('layouts:main.header.breadcrumb.links.href')}>{t('layouts:main.header.breadcrumb.links.text')}</a>
          </li>
        </ol>
      </div>
    </nav>
  );
};
