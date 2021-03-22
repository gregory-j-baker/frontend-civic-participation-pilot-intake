/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { HttpClientResponseError } from '../../../../common/HttpClientResponseError';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';
import { Gender, gendersQueryKey, gendersUri } from '../types';

export const fetchGender: QueryFunction<Promise<Gender>> = ({ queryKey }: QueryFunctionContext) => {
  const genderId = queryKey[1] as string;
  return fetchWrapper<Gender>(`${gendersUri}/${genderId}`);
};

export const useGender = (genderId: string): UseQueryResult<Gender, HttpClientResponseError> => {
  return useQuery([gendersQueryKey, genderId], fetchGender, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
