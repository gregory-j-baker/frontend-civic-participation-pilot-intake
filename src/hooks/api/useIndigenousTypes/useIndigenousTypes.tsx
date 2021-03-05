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

export interface IndigenousType {
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

export interface IndigenousTypeResponse extends HateoasCollection {
  _embedded: {
    indigenousTypes: IndigenousType[];
  };
}

export interface UseIndigenousTypesOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const uri = `${apiConfig.baseUri}/indigenous-types`;

export const fetchIndigenousTypes = (): Promise<IndigenousTypeResponse> => fetch(uri).then((res) => res.json());

const useIndigenousTypes = ({ enabled = true, onlyActive = true, sort = true }: UseIndigenousTypesOptions = {}): UseQueryResult<IndigenousTypeResponse, unknown> => {
  return useQuery('indigenous-types', fetchIndigenousTypes, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.indigenousTypes = data._embedded.indigenousTypes.filter((indigenousType) => {
          const active = indigenousType.activationDate ? beforeNow(new Date(indigenousType.activationDate)) : true;
          const expired = indigenousType.expirationDate ? beforeNow(new Date(indigenousType.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.indigenousTypes = data._embedded.indigenousTypes.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useIndigenousTypes;
