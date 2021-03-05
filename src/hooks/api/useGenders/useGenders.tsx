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

export interface Gender {
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

export interface GenderResponse extends HateoasCollection {
  _embedded: {
    genders: Gender[];
  };
}

export interface UseGendersOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const uri = `${apiConfig.baseUri}/genders`;

export const fetchGenders = (): Promise<GenderResponse> => fetch(uri).then((res) => res.json());

const useGenders = ({ enabled = true, onlyActive = true, sort = true }: UseGendersOptions = {}): UseQueryResult<GenderResponse, unknown> => {
  return useQuery('genders', fetchGenders, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.genders = data._embedded.genders.filter((gender) => {
          const active = gender.activationDate ? beforeNow(new Date(gender.activationDate)) : true;
          const expired = gender.expirationDate ? beforeNow(new Date(gender.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.genders = data._embedded.genders.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useGenders;
