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
import type { SessionContext, HateoasCollection, Page } from '../../../common/types';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { Application, applicationsQueryKey, applicationsUri } from './types';

export interface ApplicationsResponse extends HateoasCollection {
  _embedded: {
    applications: Application[];
  };
  page?: Page;
}

export interface FetchApplicationsOptions {
  applicationStatusId?: string;
  page?: number;
}

export interface UseApplicationsOptions extends FetchApplicationsOptions {}

export const fetchApplications = async (options: FetchApplicationsOptions, context?: SessionContext): Promise<ApplicationsResponse> => {
  const session = await getSession(context);
  const accessToken = session?.accessToken;

  if (!accessToken) throw new Error('No accessToken exists');

  const { applicationStatusId, page } = options;

  const queries: string[] = [`page=${page ?? 1}`, `size=${20}`];
  if (applicationStatusId) queries.push(`applicationStatusId=${applicationStatusId}`);

  return fetchWrapper<ApplicationsResponse>(`${applicationsUri}?${queries.join('&')}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useApplications = (options: UseApplicationsOptions): UseQueryResult<ApplicationsResponse, Error> => {
  return useQuery([applicationsQueryKey, options as FetchApplicationsOptions], () => fetchApplications(options), { keepPreviousData: true });
};
