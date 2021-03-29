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
import { Language, languagesQueryKey, languagesUri } from './types';

export const fetchLanguage = (languageId: string): Promise<Language | null> => {
  return fetchWrapperNotFound<Language>(`${languagesUri}/${languageId}`);
};

export const useLanguage = (languageId: string): UseQueryResult<Language | null, HttpClientResponseError> => {
  return useQuery([languagesQueryKey, languageId], () => fetchLanguage(languageId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
