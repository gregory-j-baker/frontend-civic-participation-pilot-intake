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
import { ApplicationStatus, ApplicationStatusEnum, applicationStatusesQueryKey, applicationStatusesUri } from './types';

export interface ApplicationStatusesResponse extends HateoasCollection {
  _embedded: {
    applicationStatuses: ApplicationStatus[];
  };
}

export interface FetchApplicationStatusesOptions {
  lang?: string;
  onlyActive?: boolean;
}
export interface UseApplicationStatusesOptions extends FetchApplicationStatusesOptions {
  enabled?: boolean;
}

export const fetchApplicationStatuses = async (options: FetchApplicationStatusesOptions): Promise<ApplicationStatusesResponse> => {
  const { lang, onlyActive } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<ApplicationStatus>((o) => o.uiDisplayOrderFr) : nameof<ApplicationStatus>((o) => o.uiDisplayOrderEn)}`];

  const data = await fetchWrapper<ApplicationStatusesResponse>(`${applicationStatusesUri}?${queries.join('&')}`);

  // remove STALE
  data._embedded.applicationStatuses = data._embedded.applicationStatuses.filter((applicationStatus) => applicationStatus.id !== ApplicationStatusEnum.STALE);

  if (onlyActive) {
    data._embedded.applicationStatuses = data._embedded.applicationStatuses.filter((applicationStatus) => {
      const active = applicationStatus.activationDate ? beforeNow(new Date(applicationStatus.activationDate)) : true;
      const expired = applicationStatus.expirationDate ? beforeNow(new Date(applicationStatus.expirationDate)) : false;
      return active && !expired;
    });
  }

  return data;
};

export const useApplicationStatuses = (options: UseApplicationStatusesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<ApplicationStatusesResponse, HttpClientResponseError> => {
  const { enabled } = options;
  return useQuery([applicationStatusesQueryKey, options], () => fetchApplicationStatuses(options), {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
