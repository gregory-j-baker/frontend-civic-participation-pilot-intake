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
import { Province, provincesQueryKey, provincesUri } from './types';

export interface ProvincesResponse extends HateoasCollection {
  _embedded: {
    provinces: Province[];
  };
}

export interface FetchProvincesOptions {
  lang?: string;
}
export interface UseProvincesOptions extends FetchProvincesOptions {
  enabled?: boolean;
  onlyActive?: boolean;
}

export const fetchProvinces = (options: FetchProvincesOptions): Promise<ProvincesResponse> => {
  const { lang } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Province>((o) => o.uiDisplayOrderFr) : nameof<Province>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<ProvincesResponse>(`${provincesUri}?${queries.join('&')}`);
};

export const useProvinces = (options: UseProvincesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<ProvincesResponse, HttpClientResponseError> => {
  const { enabled, onlyActive } = options;
  return useQuery([provincesQueryKey, options], () => fetchProvinces(options), {
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
