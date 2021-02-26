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
  titleTemplate: '%s | Canada Service Corps',
  defaultTitle: 'Canada Service Corps',
  description: 'Canada Service Corps Description',
};

export const nextSeoConfigFR: NextSeoProps = {
  title: undefined,
  titleTemplate: '%s | Pilote de participation civique',
  defaultTitle: 'Pilote de participation civique',
  description: 'Description du Pilote de participation civique',
};
