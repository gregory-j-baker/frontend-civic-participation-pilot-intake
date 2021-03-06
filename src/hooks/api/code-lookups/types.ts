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
 * Application Statuses
 */
export const applicationStatusesQueryKey = 'application-statuses';
export const applicationStatusesUri = `${apiConfig.baseUri}/application-statuses`;
export interface ApplicationStatus extends Lookup {}

/**
 * @see https://dev.azure.com/youth-digital-gateway/Civic%20Participation%20Pilot/_git/api-civic-participation-intake?path=%2Fsrc%2Fmain%2Fresources%2Fdb%2Fmigration%2Fv1.1-init-data.sql&version=GBmaster&line=3&lineEnd=4&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents
 */
export enum ApplicationStatusEnum {
  CONFIRMED = 'f60405fe-4a2c-4911-bed8-0d518ad092aa',
  DECLINED = 'cb44faff-ab92-4667-ac66-8412189be383',
  DISQUALIFIED = '17a9e7ec-2b18-444a-9f26-e557bd1ea0e6',
  INELIGIBLE = '0937f5ad-ea44-4296-982f-337d48b428c5',
  NEW = 'b36a6695-4314-4fe1-bc16-bf4894b7a289',
  SELECTED = '481e798c-2b5e-4c6e-be24-1dd44a799e8e',
  STALE = 'fdcc0dd0-008a-4b7f-93c9-84eee92d6851',
  WITHDRAWN = '38267273-c36d-40db-9612-d37297d6e971',
}

/**
 * Demographics
 */
export const demographicsQueryKey = 'demographics';
export const demographicsUri = `${apiConfig.baseUri}/demographics`;
export interface Demographic extends Lookup {}

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
