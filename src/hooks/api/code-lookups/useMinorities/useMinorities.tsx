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
import { Minority, minoritiesQueryKey, minoritiesUri } from '../types';

export interface MinoritiesResponse extends HateoasCollection {
  _embedded: {
    minorities: Minority[];
  };
}

export interface UseMinoritiesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchMinoritiesOptions {
  lang?: string;
}

export const fetchMinorities: QueryFunction<Promise<MinoritiesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchMinoritiesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Minority>((o) => o.uiDisplayOrderFr) : nameof<Minority>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<MinoritiesResponse>(`${minoritiesUri}?${queries.join('&')}`);
};

export const useMinorities = ({ enabled, lang, onlyActive }: UseMinoritiesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<MinoritiesResponse, unknown> => {
  return useQuery([minoritiesQueryKey, { lang } as FetchMinoritiesOptions], fetchMinorities, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.minorities = data._embedded.minorities.filter((minority) => {
          const active = minority.activationDate ? beforeNow(new Date(minority.activationDate)) : true;
          const expired = minority.expirationDate ? beforeNow(new Date(minority.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
