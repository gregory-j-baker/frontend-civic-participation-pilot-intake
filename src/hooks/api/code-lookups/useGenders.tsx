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
import { Gender, gendersQueryKey, gendersUri } from './types';

export interface GendersResponse extends HateoasCollection {
  _embedded: {
    genders: Gender[];
  };
}

export interface FetchGendersOptions {
  lang?: string;
  onlyActive?: boolean;
}

export interface UseGendersOptions extends FetchGendersOptions {
  enabled?: boolean;
}

export const fetchGenders = async (options: FetchGendersOptions): Promise<GendersResponse> => {
  const { lang, onlyActive } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Gender>((o) => o.uiDisplayOrderFr) : nameof<Gender>((o) => o.uiDisplayOrderEn)}`];

  const data = await fetchWrapper<GendersResponse>(`${gendersUri}?${queries.join('&')}`);

  if (onlyActive) {
    data._embedded.genders = data._embedded.genders.filter((gender) => {
      const active = gender.activationDate ? beforeNow(new Date(gender.activationDate)) : true;
      const expired = gender.expirationDate ? beforeNow(new Date(gender.expirationDate)) : false;
      return active && !expired;
    });
  }

  return data;
};

export const useGenders = (options: UseGendersOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<GendersResponse, HttpClientResponseError> => {
  const { enabled } = options;
  return useQuery([gendersQueryKey, options], () => fetchGenders(options), {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
