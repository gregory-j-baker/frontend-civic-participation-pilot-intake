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
import { Demographic, demographicsQueryKey, demographicsUri } from './types';

export interface DemographicsResponse extends HateoasCollection {
  _embedded: {
    demographics: Demographic[];
  };
}

export interface FetchDemographicsOptions {
  lang?: string;
  onlyActive?: boolean;
}

export interface UseDemographicsOptions extends FetchDemographicsOptions {
  enabled?: boolean;
}

export const fetchDemographics = async (options: FetchDemographicsOptions): Promise<DemographicsResponse> => {
  const { lang, onlyActive } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Demographic>((o) => o.uiDisplayOrderFr) : nameof<Demographic>((o) => o.uiDisplayOrderEn)}`];

  const data = await fetchWrapper<DemographicsResponse>(`${demographicsUri}?${queries.join('&')}`);

  if (onlyActive) {
    data._embedded.demographics = data._embedded.demographics.filter((demographic) => {
      const active = demographic.activationDate ? beforeNow(new Date(demographic.activationDate)) : true;
      const expired = demographic.expirationDate ? beforeNow(new Date(demographic.expirationDate)) : false;
      return active && !expired;
    });
  }

  return data;
};

export const useDemographics = (options: UseDemographicsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<DemographicsResponse, HttpClientResponseError> => {
  const { enabled } = options;
  return useQuery([demographicsQueryKey, options], () => fetchDemographics(options), {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
