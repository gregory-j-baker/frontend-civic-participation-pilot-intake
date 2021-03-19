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
import { InternetQuality, internetQualitiesQueryKey, internetQualitiesUri } from '../types';

export interface InternetQualitiesResponse extends HateoasCollection {
  _embedded: {
    internetQualities: InternetQuality[];
  };
}

export interface UseInternetQualitiesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchInternetQualitiesOptions {
  lang?: string;
}

export const fetchInternetQualities: QueryFunction<Promise<InternetQualitiesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchInternetQualitiesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<InternetQuality>((o) => o.uiDisplayOrderFr) : nameof<InternetQuality>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<InternetQualitiesResponse>(`${internetQualitiesUri}?${queries.join('&')}`);
};

export const useInternetQualities = ({ enabled, lang, onlyActive }: UseInternetQualitiesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<InternetQualitiesResponse, unknown> => {
  return useQuery([internetQualitiesQueryKey, { lang } as FetchInternetQualitiesOptions], fetchInternetQualities, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.internetQualities = data._embedded.internetQualities.filter((internetQuality) => {
          const active = internetQuality.activationDate ? beforeNow(new Date(internetQuality.activationDate)) : true;
          const expired = internetQuality.expirationDate ? beforeNow(new Date(internetQuality.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
