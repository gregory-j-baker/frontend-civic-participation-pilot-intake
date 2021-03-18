/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryKey, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import type { HateoasCollection, HateoasLink } from '../../../common/types';
import { apiConfig } from '../../../config';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';

export interface Province {
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

export interface ProvinceResponse extends HateoasCollection {
  _embedded: {
    provinces: Province[];
  };
}

export interface UseProvincesOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const provincesUri = `${apiConfig.baseUri}/provinces`;

export const provincesQueryKey: QueryKey = 'provinces';

export const fetchProvinces = (): Promise<ProvinceResponse> => fetchWrapper<ProvinceResponse>(provincesUri);

export const useProvinces = ({ enabled = true, onlyActive = true, sort = true }: UseProvincesOptions = {}): UseQueryResult<ProvinceResponse, unknown> => {
  return useQuery(provincesQueryKey, fetchProvinces, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.provinces = data._embedded.provinces.filter((province) => {
          const active = province.activationDate ? beforeNow(new Date(province.activationDate)) : true;
          const expired = province.expirationDate ? beforeNow(new Date(province.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.provinces = data._embedded.provinces.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};
