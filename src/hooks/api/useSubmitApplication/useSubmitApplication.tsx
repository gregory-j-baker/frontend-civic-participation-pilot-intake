/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMutation, UseMutationResult } from 'react-query';
import { apiConfig } from '../../../config';

interface ApplicationData {
  birthYear?: number;
  communityInterest?: string;
  discoveryChannelId?: string;
  educationLevelId?: string | null;
  email?: string;
  firstName?: string;
  genderId?: string | null;
  hasDedicatedDevice?: boolean;
  indigenousTypeId?: string;
  internetQualityId?: string;
  isCanadianCitizen?: boolean;
  isDisabled?: boolean | null;
  isLgbtq?: boolean | null;
  isMinority?: boolean | null;
  isNewcomer?: boolean | null;
  isRural?: boolean | null;
  languageId?: string;
  lastName?: string;
  miscInterest?: string;
  programInterest?: string;
  provinceId?: string;
  skillsInterest?: string;
}

export const uri = `${apiConfig.baseUri}/applications`;

const useSubmitApplication = (): UseMutationResult<Response, unknown, ApplicationData> => {
  return useMutation((applicationData: ApplicationData) => {
    return fetch(uri, {
      body: JSON.stringify(applicationData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });
};

export default useSubmitApplication;
export type { ApplicationData };
