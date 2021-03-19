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
import { Rural, ruralsQueryKey, ruralsUri } from '../types';

export interface RuralsResponse extends HateoasCollection {
  _embedded: {
    ruralEntities: Rural[];
  };
}

export interface UseRuralsOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchRuralsOptions {
  lang?: string;
}

export const fetchRurals: QueryFunction<Promise<RuralsResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchRuralsOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Rural>((o) => o.uiDisplayOrderFr) : nameof<Rural>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<RuralsResponse>(`${ruralsUri}?${queries.join('&')}`);
};

export const useRurals = ({ enabled, lang, onlyActive }: UseRuralsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<RuralsResponse, unknown> => {
  return useQuery([ruralsQueryKey, { lang } as FetchRuralsOptions], fetchRurals, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.ruralEntities = data._embedded.ruralEntities.filter((rural) => {
          const active = rural.activationDate ? beforeNow(new Date(rural.activationDate)) : true;
          const expired = rural.expirationDate ? beforeNow(new Date(rural.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
