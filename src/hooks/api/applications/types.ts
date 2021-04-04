/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { apiConfig } from '../../../config';

export const applicationsQueryKey = 'applications';
export const applicationsUri = `${apiConfig.baseUri}/applications`;

export interface ApplicationBase {
  birthYear: number;
  communityInterest: string;
  demographicId: string;
  discoveryChannelId: string;
  educationLevelId: string;
  email: string;
  firstName: string;
  genderId: string;
  isCanadianCitizen: boolean;
  languageId: string;
  lastName: string;
  phoneNumber?: string;
  provinceId: string;
  skillsInterest: string;
}

export interface Application extends ApplicationBase {
  accessCode: number;
  accessToken: string;
  applicationStatusId: string;
  createdBy: string;
  createdDate: string;
  emailVerificationId: string;
  id: string;
  isEmailValidated: boolean;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface ApplicationSubmitData extends ApplicationBase {}
