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
  dateModified: getDateModified(),
  gitCommit: getGitCommit(),
  version: getApplicationVersion(),
  canadaServiceCorpsUrl: {
    en: process.env.NEXT_PUBLIC_CSC_URL_EN ?? 'https://www.canada.ca/en/services/youth/canada-service-corps.html',
    fr: process.env.NEXT_PUBLIC_CSC_URL_FR ?? 'https://www.canada.ca/fr/services/jeunesse/service-jeunesse-canada.html',
  },
};

/**
 * API specific configuration.
 */
export const apiConfig = {
  baseUri: process.env.NEXT_PUBLIC_API_INTAKE_BASE_URI,
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
  description: 'Accédez rapidement et facilement à tous les services et renseignements du gouvernement du Canada.',
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
