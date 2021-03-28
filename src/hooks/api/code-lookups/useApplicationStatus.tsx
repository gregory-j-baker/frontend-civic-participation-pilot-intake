/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { ApplicationStatus, applicationStatusesQueryKey, applicationStatusesUri } from './types';

export const fetchApplicationStatus: QueryFunction<Promise<ApplicationStatus>> = ({ queryKey }: QueryFunctionContext) => {
  const applicationStatusId = queryKey[1] as string;
  return fetchWrapper<ApplicationStatus>(`${applicationStatusesUri}/${applicationStatusId}`);
};

export const useApplicationStatus = (applicationStatusId: string): UseQueryResult<ApplicationStatus, HttpClientResponseError> => {
  return useQuery([applicationStatusesQueryKey, applicationStatusId], fetchApplicationStatus, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
