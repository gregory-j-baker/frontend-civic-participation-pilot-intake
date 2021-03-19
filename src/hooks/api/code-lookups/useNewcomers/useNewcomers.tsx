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
import { Newcomer, newcomersQueryKey, newcomersUri } from '../types';

export interface NewcomersResponse extends HateoasCollection {
  _embedded: {
    newcomers: Newcomer[];
  };
}

export interface UseNewcomersOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchNewcomersOptions {
  lang?: string;
}

export const fetchNewcomers: QueryFunction<Promise<NewcomersResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchNewcomersOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Newcomer>((o) => o.uiDisplayOrderFr) : nameof<Newcomer>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<NewcomersResponse>(`${newcomersUri}?${queries.join('&')}`);
};

export const useNewcomers = ({ enabled, lang, onlyActive }: UseNewcomersOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<NewcomersResponse, unknown> => {
  return useQuery([newcomersQueryKey, { lang } as FetchNewcomersOptions], fetchNewcomers, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.newcomers = data._embedded.newcomers.filter((newcomer) => {
          const active = newcomer.activationDate ? beforeNow(new Date(newcomer.activationDate)) : true;
          const expired = newcomer.expirationDate ? beforeNow(new Date(newcomer.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
