/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { fetchWrapperNotFound } from '../../../utils/fetch-wrapper';
import { EducationLevel, educationLevelsQueryKey, educationLevelsUri } from './types';

export const fetchEducationLevel: QueryFunction<Promise<EducationLevel | null>> = ({ queryKey }: QueryFunctionContext) => {
  const educationLevelId = queryKey[1] as string;
  return fetchWrapperNotFound<EducationLevel>(`${educationLevelsUri}/${educationLevelId}`);
};

export const useEducationLevel = (educationLevelId: string): UseQueryResult<EducationLevel | null, HttpClientResponseError> => {
  return useQuery([educationLevelsQueryKey, educationLevelId], fetchEducationLevel, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
