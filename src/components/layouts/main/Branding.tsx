/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';

export const Branding = (): JSX.Element => {
  const { t, lang } = useTranslation();

  return (
    <div className="brand col-xs-9 col-sm-5 col-md-4" property="publisher" typeof="GovernmentOrganization">
      <link href={t('layouts:main.header.branding.main-site-url')} property="url" />

      <img src={t('layouts:main.header.branding.logo-url.goc')} alt={t('layouts:main.header.branding.name')} property="logo" />
      <span className="wb-inv">
        {' '}
        /<span lang={lang}>{t('layouts:main.header.branding.name')}</span>
      </span>

      <meta property="name" content={t('layouts:main.header.branding.name')} />
      <meta property="areaServed" typeof="Country" content={t('layouts:main.header.branding.country')} />
      <link property="logo" href={t('layouts:main.header.branding.logo-url.canada')} />
    </div>
  );
};
