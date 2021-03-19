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
import { disabilitiesQueryKey, disabilitiesUri, Disability } from '../types';

export interface DisabilitiesResponse extends HateoasCollection {
  _embedded: {
    disabilities: Disability[];
  };
}

export interface UseDisabilitiesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchDisabilitiesOptions {
  lang?: string;
}

export const fetchDisabilities: QueryFunction<Promise<DisabilitiesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchDisabilitiesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Disability>((o) => o.uiDisplayOrderFr) : nameof<Disability>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<DisabilitiesResponse>(`${disabilitiesUri}?${queries.join('&')}`);
};

export const useDisabilities = ({ enabled, lang, onlyActive }: UseDisabilitiesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<DisabilitiesResponse, unknown> => {
  return useQuery([disabilitiesQueryKey, { lang } as FetchDisabilitiesOptions], fetchDisabilities, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.disabilities = data._embedded.disabilities.filter((disability) => {
          const active = disability.activationDate ? beforeNow(new Date(disability.activationDate)) : true;
          const expired = disability.expirationDate ? beforeNow(new Date(disability.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
