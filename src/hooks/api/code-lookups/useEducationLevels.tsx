/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../common/types';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { EducationLevel, educationLevelsQueryKey, educationLevelsUri } from './types';

export interface EducationLevelsResponse extends HateoasCollection {
  _embedded: {
    educationLevels: EducationLevel[];
  };
}

export interface FetchEducationLevelsOptions {
  lang?: string;
  onlyActive?: boolean;
}

export interface UseEducationLevelsOptions extends FetchEducationLevelsOptions {
  enabled?: boolean;
}

export const fetchEducationLevels = async (options: FetchEducationLevelsOptions): Promise<EducationLevelsResponse> => {
  const { lang, onlyActive } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<EducationLevel>((o) => o.uiDisplayOrderFr) : nameof<EducationLevel>((o) => o.uiDisplayOrderEn)}`];

  const data = await fetchWrapper<EducationLevelsResponse>(`${educationLevelsUri}?${queries.join('&')}`);

  if (onlyActive) {
    data._embedded.educationLevels = data._embedded.educationLevels.filter((educationLevel) => {
      const active = educationLevel.activationDate ? beforeNow(new Date(educationLevel.activationDate)) : true;
      const expired = educationLevel.expirationDate ? beforeNow(new Date(educationLevel.expirationDate)) : false;
      return active && !expired;
    });
  }

  return data;
};

export const useEducationLevels = (options: UseEducationLevelsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<EducationLevelsResponse, HttpClientResponseError> => {
  const { enabled } = options;
  return useQuery([educationLevelsQueryKey, options], () => fetchEducationLevels(options), {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
