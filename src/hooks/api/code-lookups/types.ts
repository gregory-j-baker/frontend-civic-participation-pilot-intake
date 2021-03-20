/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HateoasLink } from '../../../common/types';
import { apiConfig } from '../../../config';

/**
 * Lookup base interface
 */
export interface Lookup {
  id: string;

  activationDate?: string;
  code: string;
  descriptionEn: string;
  descriptionFr: string;
  expirationDate?: string;
  uiDisplayOrderEn?: number;
  uiDisplayOrderFr?: number;

  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;

  _links: HateoasLink[];
}

/**
 * Discovery Channels
 */
export const discoveryChannelsQueryKey = 'discovery-channels';
export const discoveryChannelsUri = `${apiConfig.baseUri}/discovery-channels`;
export interface DiscoveryChannel extends Lookup {}

/**
 * Education Levels
 */
export const educationLevelsQueryKey = 'education-levels';
export const educationLevelsUri = `${apiConfig.baseUri}/education-levels`;
export interface EducationLevel extends Lookup {}

/**
 * Genders
 */
export const gendersQueryKey = 'genders';
export const gendersUri = `${apiConfig.baseUri}/genders`;
export interface Gender extends Lookup {}

/**
 * Languages
 */
export const languagesQueryKey = 'languages';
export const languagesUri = `${apiConfig.baseUri}/languages`;
export interface Language extends Lookup {}

/**
 * Provinces
 */
export const provincesQueryKey = 'provinces';
export const provincesUri = `${apiConfig.baseUri}/provinces`;
export interface Province extends Lookup {}
