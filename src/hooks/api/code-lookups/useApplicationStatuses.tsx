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
import { ApplicationStatus, applicationStatusesQueryKey, applicationStatusesUri } from './types';

export interface ApplicationStatusesResponse extends HateoasCollection {
  _embedded: {
    applicationStatuses: ApplicationStatus[];
  };
}

export interface UseApplicationStatusesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchApplicationStatusesOptions {
  lang?: string;
}

export const fetchApplicationStatuses: QueryFunction<Promise<ApplicationStatusesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchApplicationStatusesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<ApplicationStatus>((o) => o.uiDisplayOrderFr) : nameof<ApplicationStatus>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<ApplicationStatusesResponse>(`${applicationStatusesUri}?${queries.join('&')}`);
};

export const useApplicationStatuses = ({ enabled, lang, onlyActive }: UseApplicationStatusesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<ApplicationStatusesResponse, HttpClientResponseError> => {
  return useQuery([applicationStatusesQueryKey, { lang } as FetchApplicationStatusesOptions], fetchApplicationStatuses, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.applicationStatuses = data._embedded.applicationStatuses.filter((applicationStatus) => {
          const active = applicationStatus.activationDate ? beforeNow(new Date(applicationStatus.activationDate)) : true;
          const expired = applicationStatus.expirationDate ? beforeNow(new Date(applicationStatus.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
