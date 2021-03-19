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
 * Disabilities
 */
export const disabilitiesQueryKey = 'disabilities';
export const disabilitiesUri = `${apiConfig.baseUri}/disabilities`;
export interface Disability extends Lookup {}

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
 * Indigenous Types
 */
export const indigenousTypesQueryKey = 'indigenous-types';
export const indigenousTypesUri = `${apiConfig.baseUri}/indigenous-types`;
export interface IndigenousType extends Lookup {}

/**
 * Internet Qualities
 */
export const internetQualitiesQueryKey = 'internet-qualities';
export const internetQualitiesUri = `${apiConfig.baseUri}/internet-qualities`;
export interface InternetQuality extends Lookup {}

/**
 * Languages
 */
export const languagesQueryKey = 'languages';
export const languagesUri = `${apiConfig.baseUri}/languages`;
export interface Language extends Lookup {}

/**
 * Minorities
 */
export const minoritiesQueryKey = 'minorities';
export const minoritiesUri = `${apiConfig.baseUri}/minorities`;
export interface Minority extends Lookup {}

/**
 * Newcomers
 */
export const newcomersQueryKey = 'newcomers';
export const newcomersUri = `${apiConfig.baseUri}/newcomers`;
export interface Newcomer extends Lookup {}

/**
 * Provinces
 */
export const provincesQueryKey = 'provinces';
export const provincesUri = `${apiConfig.baseUri}/provinces`;
export interface Province extends Lookup {}

/**
 * Rurals
 */
export const ruralsQueryKey = 'rurals';
export const ruralsUri = `${apiConfig.baseUri}/rurals`;
export interface Rural extends Lookup {}

/**
 * Sexual Orientations
 */
export const sexualOrientationsQueryKey = 'sexual-orientations';
export const sexualOrientationsUri = `${apiConfig.baseUri}/sexual-orientations`;
export interface SexualOrientation extends Lookup {}
