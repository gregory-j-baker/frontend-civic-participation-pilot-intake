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
import { EducationLevel, educationLevelsQueryKey, educationLevelsUri } from './types';

export const fetchEducationLevel = (educationLevelId: string): Promise<EducationLevel | null> => {
  return fetchWrapperNotFound<EducationLevel>(`${educationLevelsUri}/${educationLevelId}`);
};

export const useEducationLevel = (educationLevelId: string): UseQueryResult<EducationLevel | null, HttpClientResponseError> => {
  return useQuery([educationLevelsQueryKey, educationLevelId], () => fetchEducationLevel(educationLevelId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
