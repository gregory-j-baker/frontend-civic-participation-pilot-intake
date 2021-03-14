/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryKey, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import type { HateoasCollection, HateoasLink } from '../../../common/types';
import { apiConfig } from '../../../config';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';

export interface EducationLevel {
  id: string;

  activationDate?: string;
  code: string;
  descriptionEn: string;
  descriptionFr: string;
  expirationDate?: string;
  uiDisplayOrder?: number;

  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;

  _links: HateoasLink[];
}

export interface EducationLevelResponse extends HateoasCollection {
  _embedded: {
    educationLevels: EducationLevel[];
  };
}

export interface UseEducationLevelsOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const educationLevelsUri = `${apiConfig.baseUri}/education-levels`;

export const educationLevelsQueryKey: QueryKey = 'education-levels';

export const fetchEducationLevels = (): Promise<EducationLevelResponse> => fetchWrapper<EducationLevelResponse>(educationLevelsUri);

const useEducationLevels = ({ enabled = true, onlyActive = true, sort = true }: UseEducationLevelsOptions = {}): UseQueryResult<EducationLevelResponse, unknown> => {
  return useQuery(educationLevelsQueryKey, fetchEducationLevels, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.educationLevels = data._embedded.educationLevels.filter((educationLevel) => {
          const active = educationLevel.activationDate ? beforeNow(new Date(educationLevel.activationDate)) : true;
          const expired = educationLevel.expirationDate ? beforeNow(new Date(educationLevel.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.educationLevels = data._embedded.educationLevels.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useEducationLevels;
