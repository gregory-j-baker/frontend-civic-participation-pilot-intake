/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { fetchWrapperNotFound } from '../../../utils/fetch-wrapper';
import type { SessionContext } from '../../../common/types';
import { Application, applicationsQueryKey, applicationsUri } from './types';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';

export interface ApplicationResponse {
  application: Application;
}

export const fetchApplication = async (applicationId: string, context?: SessionContext): Promise<ApplicationResponse | null> => {
  const session = await getSession(context);
  const accessToken = session?.accessToken;

  if (!accessToken) throw new Error('No accessToken exists');

  return fetchWrapperNotFound<ApplicationResponse>(`${applicationsUri}/${applicationId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const useApplication = (applicationId: string): UseQueryResult<ApplicationResponse | null, HttpClientResponseError> => {
  return useQuery([applicationsQueryKey, applicationId], () => fetchApplication(applicationId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
