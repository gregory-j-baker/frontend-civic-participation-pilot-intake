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
import { SexualOrientation, sexualOrientationsQueryKey, sexualOrientationsUri } from '../types';

export interface SexualOrientationsResponse extends HateoasCollection {
  _embedded: {
    sexualOrientations: SexualOrientation[];
  };
}

export interface UseSexualOrientationsOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchSexualOrientationsOptions {
  lang?: string;
}

export const fetchSexualOrientations: QueryFunction<Promise<SexualOrientationsResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchSexualOrientationsOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<SexualOrientation>((o) => o.uiDisplayOrderFr) : nameof<SexualOrientation>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<SexualOrientationsResponse>(`${sexualOrientationsUri}?${queries.join('&')}`);
};

export const useSexualOrientations = ({ enabled, lang, onlyActive }: UseSexualOrientationsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<SexualOrientationsResponse, unknown> => {
  return useQuery([sexualOrientationsQueryKey, { lang } as FetchSexualOrientationsOptions], fetchSexualOrientations, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.sexualOrientations = data._embedded.sexualOrientations.filter((sexualOrientation) => {
          const active = sexualOrientation.activationDate ? beforeNow(new Date(sexualOrientation.activationDate)) : true;
          const expired = sexualOrientation.expirationDate ? beforeNow(new Date(sexualOrientation.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
