/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextSeoProps } from 'next-seo';
import { getApplicationVersion, getDateModified, getGitCommit } from './utils/misc-utils';

/**
 * Application specific configuration.
 */
export const applicationConfig = {
  appInsightsInstrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY,
  canadaMenuUrl: {
    en: process.env.NEXT_PUBLIC_CANADA_MENU_URL_EN ?? 'https://www.canada.ca/content/dam/canada/sitemenu/sitemenu-v2-en.html',
    fr: process.env.NEXT_PUBLIC_CANADA_MENU_URL_FR ?? 'https://www.canada.ca/content/dam/canada/sitemenu/sitemenu-v2-fr.html',
  },
  canadaServiceCorpsUrl: {
    en: process.env.NEXT_PUBLIC_CSC_URL_EN ?? 'https://www.canada.ca/en/services/youth/canada-service-corps.html',
    fr: process.env.NEXT_PUBLIC_CSC_URL_FR ?? 'https://www.canada.ca/fr/services/jeunesse/service-jeunesse-canada.html',
  },
  dateModified: getDateModified(),
  gitCommit: getGitCommit(),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@example.com',
  version: getApplicationVersion(),
};

/**
 * API specific configuration.
 */
export const apiConfig = {
  baseUri: process.env.NEXT_PUBLIC_API_INTAKE_BASE_URI,
  maxEmailVerificationAttempts: (process.env.NEXT_PUBLIC_API_MAX_EMAIL_VERIFICATION_ATTEMPTS ?? 5) as number,
};

/**
 * Next-SEO specific configuration.
 */
export const nextSeoConfigEN: NextSeoProps = {
  title: undefined,
  titleTemplate: '%s - Civic Participation Pilot - Canada.ca',
  defaultTitle: 'Civic Participation Pilot - Canada.ca',
  description: 'Get quick, easy access to all Government of Canada services and information.',
};

export const nextSeoConfigFR: NextSeoProps = {
  title: undefined,
  titleTemplate: '%s - Pilote de participation civique - Canada.ca',
  defaultTitle: 'Pilote de participation civique - Canada.ca',
  description: 'Acc??dez rapidement et facilement ?? tous les services et renseignements du gouvernement du Canada.',
};

/**
 * WET Theme configuration.
 */

export const theme = {
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200,
  },
};
