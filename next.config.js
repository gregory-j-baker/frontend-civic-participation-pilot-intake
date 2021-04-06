/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const nextTranslate = require('next-translate');

let nextConfig = {
  pageExtensions: ['tsx'],
  future: { webpack5: true },
  redirects: async () => [
    {
      source: '/application',
      destination: '/application/step-1',
      permanent: false,
    },
  ],
};

/**
 * @see https://nextjs.org/docs/advanced-features/i18n-routing
 */
if (process.env.FRONTEND_FQDN_EN && process.env.FRONTEND_FQDN_FR) {
  nextConfig = {
    ...nextConfig,
    ...{
      domains: [
        {
          domain: process.env.FRONTEND_FQDN_EN,
          defaultLocale: 'en',
        },
        {
          domain: process.env.FRONTEND_FQDN_FR,
          defaultLocale: 'fr',
        },
      ],
    },
  };
}

module.exports = nextTranslate(nextConfig);
