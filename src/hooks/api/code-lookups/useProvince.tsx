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
import { Province, provincesQueryKey, provincesUri } from './types';

export const fetchProvince: QueryFunction<Promise<Province>> = ({ queryKey }: QueryFunctionContext) => {
  const provinceId = queryKey[1] as string;
  return fetchWrapper<Province>(`${provincesUri}/${provinceId}`);
};

export const useProvince = (provinceId: string): UseQueryResult<Province, HttpClientResponseError> => {
  return useQuery([provincesQueryKey, provinceId], fetchProvince, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
