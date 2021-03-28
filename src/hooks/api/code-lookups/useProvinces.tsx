/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunction, QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../common/types';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { Province, provincesQueryKey, provincesUri } from './types';

export interface ProvincesResponse extends HateoasCollection {
  _embedded: {
    provinces: Province[];
  };
}

export interface UseProvincesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchProvincesOptions {
  lang?: string;
}

export const fetchProvinces: QueryFunction<Promise<ProvincesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchProvincesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Province>((o) => o.uiDisplayOrderFr) : nameof<Province>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<ProvincesResponse>(`${provincesUri}?${queries.join('&')}`);
};

export const useProvinces = ({ enabled, lang, onlyActive }: UseProvincesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<ProvincesResponse, HttpClientResponseError> => {
  return useQuery([provincesQueryKey, { lang } as FetchProvincesOptions], fetchProvinces, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.provinces = data._embedded.provinces.filter((province) => {
          const active = province.activationDate ? beforeNow(new Date(province.activationDate)) : true;
          const expired = province.expirationDate ? beforeNow(new Date(province.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
