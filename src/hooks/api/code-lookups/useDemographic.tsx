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
import { Demographic, demographicsQueryKey, demographicsUri } from './types';

export const fetchDemographic: QueryFunction<Promise<Demographic>> = ({ queryKey }: QueryFunctionContext) => {
  const demographicId = queryKey[1] as string;
  return fetchWrapper<Demographic>(`${demographicsUri}/${demographicId}`);
};

export const useDemographic = (demographicId: string): UseQueryResult<Demographic, HttpClientResponseError> => {
  return useQuery([demographicsQueryKey, demographicId], fetchDemographic, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
