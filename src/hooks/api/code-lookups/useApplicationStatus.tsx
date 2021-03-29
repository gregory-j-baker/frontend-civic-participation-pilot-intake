/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { fetchWrapperNotFound } from '../../../utils/fetch-wrapper';
import { ApplicationStatus, applicationStatusesQueryKey, applicationStatusesUri } from './types';

export const fetchApplicationStatus = async (applicationStatusId: string): Promise<ApplicationStatus | null> => {
  return fetchWrapperNotFound<ApplicationStatus>(`${applicationStatusesUri}/${applicationStatusId}`);
};

export const useApplicationStatus = (applicationStatusId: string): UseQueryResult<ApplicationStatus | null, HttpClientResponseError> => {
  return useQuery([applicationStatusesQueryKey, applicationStatusId], () => fetchApplicationStatus(applicationStatusId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
