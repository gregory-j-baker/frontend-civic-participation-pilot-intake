/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunction, QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import type { HateoasCollection } from '../../../../common/types';
import { beforeNow } from '../../../../utils/date-utils';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';
import { EducationLevel, educationLevelsQueryKey, educationLevelsUri } from '../types';

export interface EducationLevelsResponse extends HateoasCollection {
  _embedded: {
    educationLevels: EducationLevel[];
  };
}

export interface UseEducationLevelsOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchEducationLevelsOptions {
  lang?: string;
}

export const fetchEducationLevels: QueryFunction<Promise<EducationLevelsResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchEducationLevelsOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<EducationLevel>((o) => o.uiDisplayOrderFr) : nameof<EducationLevel>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<EducationLevelsResponse>(`${educationLevelsUri}?${queries.join('&')}`);
};

export const useEducationLevels = ({ enabled, lang, onlyActive }: UseEducationLevelsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<EducationLevelsResponse, unknown> => {
  return useQuery([educationLevelsQueryKey, { lang } as FetchEducationLevelsOptions], fetchEducationLevels, {
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
    },
  });
};
