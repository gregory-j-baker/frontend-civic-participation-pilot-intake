/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import type { SessionContext, HateoasCollection } from '../../../common/types';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { Application, applicationsQueryKey, applicationsUri } from './types';

export interface ApplicationsResponse extends HateoasCollection {
  _embedded: {
    applications: Application[];
  };
}

export interface UseApplicationsOptions {
  applicationStatusId?: string;
  page?: number;
}

export interface FetchApplicationsOptions {
  applicationStatusId?: string;
  page?: number;
}

export const fetchApplications: QueryFunction<Promise<ApplicationsResponse>> = async ({ queryKey }: QueryFunctionContext, context?: SessionContext) => {
  const session = await getSession(context);
  const accessToken = session?.accessToken;

  if (!accessToken) throw new Error('No accessToken exists');

  const { applicationStatusId, page } = queryKey[1] as FetchApplicationsOptions;

  const queries: string[] = [];
  queries.push(`page=${page ?? 1}`);
  queries.push(`size=${20}`);
  if (applicationStatusId) queries.push(`applicationStatusId=${applicationStatusId}`);

  return fetchWrapper<ApplicationsResponse>(`${applicationsUri}?${queries.join('&')}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useApplications = (options: UseApplicationsOptions): UseQueryResult<ApplicationsResponse, Error> => {
  return useQuery([applicationsQueryKey, options as FetchApplicationsOptions], fetchApplications, { keepPreviousData: true });
};
