/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunction, QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../../common/types';
import { beforeNow } from '../../../../utils/date-utils';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';
import { Gender, gendersQueryKey, gendersUri } from '../types';

export interface GendersResponse extends HateoasCollection {
  _embedded: {
    genders: Gender[];
  };
}

export interface UseGendersOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchGendersOptions {
  lang?: string;
}

export const fetchGenders: QueryFunction<Promise<GendersResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchGendersOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Gender>((o) => o.uiDisplayOrderFr) : nameof<Gender>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<GendersResponse>(`${gendersUri}?${queries.join('&')}`);
};

export const useGenders = ({ enabled, lang, onlyActive }: UseGendersOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<GendersResponse, HttpClientResponseError> => {
  return useQuery([gendersQueryKey, { lang } as FetchGendersOptions], fetchGenders, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.genders = data._embedded.genders.filter((gender) => {
          const active = gender.activationDate ? beforeNow(new Date(gender.activationDate)) : true;
          const expired = gender.expirationDate ? beforeNow(new Date(gender.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
