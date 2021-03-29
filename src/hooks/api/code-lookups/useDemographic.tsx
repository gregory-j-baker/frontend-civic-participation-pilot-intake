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
import { Demographic, demographicsQueryKey, demographicsUri } from './types';

export const fetchDemographic = (demographicId: string): Promise<Demographic | null> => {
  return fetchWrapperNotFound<Demographic>(`${demographicsUri}/${demographicId}`);
};

export const useDemographic = (demographicId: string): UseQueryResult<Demographic | null, HttpClientResponseError> => {
  return useQuery([demographicsQueryKey, demographicId], () => fetchDemographic(demographicId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
