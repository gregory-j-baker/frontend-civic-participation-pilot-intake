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
import { Gender, gendersQueryKey, gendersUri } from './types';

export const fetchGender = (genderId: string): Promise<Gender | null> => {
  return fetchWrapperNotFound<Gender>(`${gendersUri}/${genderId}`);
};

export const useGender = (genderId: string): UseQueryResult<Gender | null, HttpClientResponseError> => {
  return useQuery([gendersQueryKey, genderId], () => fetchGender(genderId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
