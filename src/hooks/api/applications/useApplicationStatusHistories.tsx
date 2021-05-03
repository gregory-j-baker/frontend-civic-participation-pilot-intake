/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import type { SessionContext, AADSession } from '../../../common/types';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { ApplicationStatusHistory, applicationsQueryKey, applicationsUri } from './types';

export interface ApplicationStatusHistoriesResponse {
  _embedded: {
    applicationStatusHistories: ApplicationStatusHistory[];
  };
}

export interface FetchApplicationStatusHistoriesOptions {
  sort?: string[];
}

export const fetchApplicationStatusHistories = async (applicationId: string, options: FetchApplicationStatusHistoriesOptions, context?: SessionContext): Promise<ApplicationStatusHistoriesResponse> => {
  const session = (await getSession(context)) as AADSession;
  if (!session || Date.now() >= session.accessTokenExpires || !session.accessToken) Error('Invalid session');

  const { sort } = options;

  const queries: string[] = [];
  if (sort) sort.forEach((sortItem) => queries.push(`sort=${sortItem}`));

  return fetchWrapper<ApplicationStatusHistoriesResponse>(`${applicationsUri}/status-histories/${applicationId}${sort ? '?' + queries.join('&') : ''}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
};

export const useApplicationStatusHistories = (applicationId: string, options: FetchApplicationStatusHistoriesOptions): UseQueryResult<ApplicationStatusHistoriesResponse, Error> => {
  return useQuery([applicationsQueryKey, applicationId, options as FetchApplicationStatusHistoriesOptions], () => fetchApplicationStatusHistories(applicationId, options), { keepPreviousData: true });
};
