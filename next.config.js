/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  pageExtensions: ['tsx'],
  future: { webpack5: true },
  redirects: async () => [
    {
      source: '/application',
      destination: '/application/step-1',
      permanent: false,
    },
    {
      source: '/catchall',
      destination: '/en',
      locale: false,
      permanent: true,
    },
    {
      source: '/catchall/:slug*',
      destination: '/en/:slug*',
      locale: false,
      permanent: true,
    },
  ],
});
