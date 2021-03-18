/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { apiConfig } from '../../../config';

export interface ApplicationData {
  birthYear: number;
  communityInterest: string;
  discoveryChannelId: string;
  educationLevelId: string | null;
  email: string;
  firstName: string;
  genderId: string | null;
  hasDedicatedDevice: boolean;
  indigenousTypeId: string;
  internetQualityId: string;
  isCanadianCitizen: boolean;
  isDisabled: boolean | null;
  isLgbtq: boolean | null;
  isMinority: boolean | null;
  isNewcomer: boolean | null;
  isRural: boolean | null;
  languageId: string;
  lastName: string;
  phoneNumber?: string;
  programInterest?: string;
  provinceId: string;
  skillsInterest: string;
}

export const uri = `${apiConfig.baseUri}/applications`;

export const useSubmitApplication = (options?: UseMutationOptions<void, HttpClientResponseError, ApplicationData>): UseMutationResult<void, HttpClientResponseError, ApplicationData> => {
  return useMutation(async (applicationData): Promise<void> => {
    const response = await fetch(uri, {
      body: JSON.stringify(applicationData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const responseJson = await response
        .clone()
        .json()
        .catch(() => undefined);

      const responseText = await response
        .clone()
        .text()
        .catch(() => undefined);

      throw new HttpClientResponseError(response, 'Network response was not ok', responseJson, responseText);
    }
  }, options);
};
