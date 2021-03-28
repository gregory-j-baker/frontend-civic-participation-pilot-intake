/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../common/types';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { Demographic, demographicsQueryKey, demographicsUri } from './types';

export interface DemographicsResponse extends HateoasCollection {
  _embedded: {
    demographics: Demographic[];
  };
}

export interface UseDemographicsOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchDemographicsOptions {
  lang?: string;
}

export const fetchDemographics: QueryFunction<Promise<DemographicsResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchDemographicsOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Demographic>((o) => o.uiDisplayOrderFr) : nameof<Demographic>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<DemographicsResponse>(`${demographicsUri}?${queries.join('&')}`);
};

export const useDemographics = ({ enabled, lang, onlyActive }: UseDemographicsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<DemographicsResponse, HttpClientResponseError> => {
  return useQuery([demographicsQueryKey, { lang } as FetchDemographicsOptions], fetchDemographics, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.demographics = data._embedded.demographics.filter((demographic) => {
          const active = demographic.activationDate ? beforeNow(new Date(demographic.activationDate)) : true;
          const expired = demographic.expirationDate ? beforeNow(new Date(demographic.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
