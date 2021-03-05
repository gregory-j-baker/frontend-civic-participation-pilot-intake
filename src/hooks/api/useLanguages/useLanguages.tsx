/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import type { HateoasCollection, HateoasLink } from '../../../common/types';
import { apiConfig } from '../../../config';
import { beforeNow } from '../../../utils/date-utils';

export interface Language {
  id: string;

  activationDate?: string;
  code: string;
  descriptionEn: string;
  descriptionFr: string;
  expirationDate?: string;
  uiDisplayOrder?: number;

  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;

  _links: HateoasLink[];
}

export interface LanguageResponse extends HateoasCollection {
  _embedded: {
    languages: Language[];
  };
}

export interface UseLanguagesOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const uri = `${apiConfig.baseUri}/languages`;

export const fetchLanguages = (): Promise<LanguageResponse> => fetch(uri).then((res) => res.json());

const useLanguages = ({ enabled = true, onlyActive = true, sort = true }: UseLanguagesOptions = {}): UseQueryResult<LanguageResponse, unknown> => {
  return useQuery('languages', fetchLanguages, {
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

      if (sort) {
        data._embedded.languages = data._embedded.languages.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useLanguages;
