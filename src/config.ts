/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
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
};

/**
 * Next-SEO specific configuration.
 */
export const nextSeoConfigEN: NextSeoProps = {
  title: undefined,
  titleTemplate: '%s - Canada.ca',
  defaultTitle: 'Canada.ca',
  description: 'Get quick, easy access to all Government of Canada services and information.',
};

export const nextSeoConfigFR: NextSeoProps = {
  title: undefined,
  titleTemplate: '%s - Canada.ca',
  defaultTitle: 'Canada.ca',
  description: 'Accédez rapidement et facilement à tous les services et renseignements du gouvernement du Canada.',
};

/**
 * WET Theme configuration.
 */

export const theme = {
  breakpoints: {
    xxsmallview: 0,
    xsmallview: 480,
    smallview: 768,
    mediumview: 992,
    largeview: 1200,
    xlargeview: 1600,
  },
};
