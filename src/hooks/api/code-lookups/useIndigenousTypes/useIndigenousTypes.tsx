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
import { IndigenousType, indigenousTypesQueryKey, indigenousTypesUri } from '../types';

export interface IndigenousTypesResponse extends HateoasCollection {
  _embedded: {
    indigenousTypes: IndigenousType[];
  };
}

export interface UseIndigenousTypesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchIndigenousTypesOptions {
  lang?: string;
}

export const fetchIndigenousTypes: QueryFunction<Promise<IndigenousTypesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchIndigenousTypesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<IndigenousType>((o) => o.uiDisplayOrderFr) : nameof<IndigenousType>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<IndigenousTypesResponse>(`${indigenousTypesUri}?${queries.join('&')}`);
};

export const useIndigenousTypes = ({ enabled, lang, onlyActive }: UseIndigenousTypesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<IndigenousTypesResponse, unknown> => {
  return useQuery([indigenousTypesQueryKey, { lang } as FetchIndigenousTypesOptions], fetchIndigenousTypes, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.indigenousTypes = data._embedded.indigenousTypes.filter((indigenousType) => {
          const active = indigenousType.activationDate ? beforeNow(new Date(indigenousType.activationDate)) : true;
          const expired = indigenousType.expirationDate ? beforeNow(new Date(indigenousType.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
