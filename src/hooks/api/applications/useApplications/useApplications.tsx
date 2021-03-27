/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import type { HateoasCollection } from '../../../../common/types';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';
import { Application, applicationsQueryKey, applicationsUri } from '../types';

export interface ApplicationsResponse extends HateoasCollection {
  _embedded: {
    applications: Application[];
  };
}

export interface UseApplicationsOptions {
  applicationStatusId?: string;
}

export interface FetchApplicationsOptions {
  applicationStatusId?: string;
}

export const fetchApplications: QueryFunction<Promise<ApplicationsResponse>> = async ({ queryKey }: QueryFunctionContext) => {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (!accessToken) throw new Error('No accessToken exists');

  const { applicationStatusId } = queryKey[1] as FetchApplicationsOptions;

  const queries: string[] = [];
  if (applicationStatusId) queries.push(`applicationStatusId=${applicationStatusId}`);

  return fetchWrapper<ApplicationsResponse>(`${applicationsUri}${queries.length > 0 ? '?' : ''}${queries.join('&')}`, {
    headers: {
      Authorization: accessToken,
    },
  });
};

export const useApplications = (options: UseApplicationsOptions): UseQueryResult<ApplicationsResponse, Error> => {
  return useQuery([applicationsQueryKey, options as FetchApplicationsOptions], fetchApplications);
};
