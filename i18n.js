/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  locales: ['en', 'fr', 'catchall'],
  defaultLocale: 'catchall',
  pages: {
    '*': ['common', 'layouts', 'menu'],
    '/application/confirmation': ['application'],
    '/application/step-1': ['application'],
    '/application/step-2': ['application'],
    '/application/step-3': ['application'],
    '/application/step-4': ['application'],
    '/contact-us': ['contact-us'],
    '/contact-us/success': ['contact-us'],
    '/application/email-verification': ['email-verification'],
    '/application/email-verification/[token]': ['email-verification'],
    '/application/email-verification/failed': ['email-verification'],
    '/application/email-verification/success': ['email-verification'],
    '/management/applications': ['application'],
    '/management/applications/[id]': ['application'],
    '/management/applications/select': ['application'],
  },
};
