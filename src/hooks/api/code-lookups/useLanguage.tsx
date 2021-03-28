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
import { Language, languagesQueryKey, languagesUri } from './types';

export const fetchLanguage: QueryFunction<Promise<Language>> = ({ queryKey }: QueryFunctionContext) => {
  const languageId = queryKey[1] as string;
  return fetchWrapper<Language>(`${languagesUri}/${languageId}`);
};

export const useLanguage = (languageId: string): UseQueryResult<Language, HttpClientResponseError> => {
  return useQuery([languagesQueryKey, languageId], fetchLanguage, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
