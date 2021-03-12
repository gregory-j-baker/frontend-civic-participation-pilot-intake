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
  educationLevelId?: string;
  email?: string;
  firstName?: string;
  genderId?: string;
  hasDedicatedDevice?: boolean;
  indigenousTypeId?: string;
  internetQualityId?: string;
  isCanadianCitizen?: boolean;
  isDisabled?: boolean;
  isLgbtq?: boolean;
  isMinority?: boolean;
  isNewcomer?: boolean;
  isRural?: boolean;
  languageId?: string;
  lastName?: string;
  miscInterest?: string;
  programInterest?: string;
  provinceId?: string;
  skillsInterest?: string;
}

export const uri = `${apiConfig.baseUri}/applications`;

const useSubmitApplication = (): UseMutationResult<Response, unknown, ApplicationData> => {
  return useMutation((applicationData: ApplicationData) =>
    fetch(uri, {
      body: JSON.stringify(applicationData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  );
};

export default useSubmitApplication;
export type { ApplicationData };
