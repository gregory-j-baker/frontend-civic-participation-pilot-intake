/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunction, QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../../common/types';
import { beforeNow } from '../../../../utils/date-utils';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';
import { Language, languagesQueryKey, languagesUri } from '../types';

export interface LanguagesResponse extends HateoasCollection {
  _embedded: {
    languages: Language[];
  };
}

export interface UseLanguagesOptions {
  enabled?: boolean;
  lang?: string;
  onlyActive?: boolean;
}

export interface FetchLanguagesOptions {
  lang?: string;
}

export const fetchLanguages: QueryFunction<Promise<LanguagesResponse>> = ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchLanguagesOptions;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<Language>((o) => o.uiDisplayOrderFr) : nameof<Language>((o) => o.uiDisplayOrderEn)}`];

  return fetchWrapper<LanguagesResponse>(`${languagesUri}?${queries.join('&')}`);
};

export const useLanguages = ({ enabled, lang, onlyActive }: UseLanguagesOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<LanguagesResponse, HttpClientResponseError> => {
  return useQuery([languagesQueryKey, { lang } as FetchLanguagesOptions], fetchLanguages, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.languages = data._embedded.languages.filter((language) => {
          const active = language.activationDate ? beforeNow(new Date(language.activationDate)) : true;
          const expired = language.expirationDate ? beforeNow(new Date(language.expirationDate)) : false;
          return active && !expired;
        });
      }
    },
  });
};
