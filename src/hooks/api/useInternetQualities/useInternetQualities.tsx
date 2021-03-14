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

export interface InternetQuality {
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

export interface InternetQualityResponse extends HateoasCollection {
  _embedded: {
    internetQualities: InternetQuality[];
  };
}

export interface UseInternetQualitiesOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const internetQualitiesUri = `${apiConfig.baseUri}/internet-qualities`;

export const internetQualitiesQueryKey: QueryKey = 'internet-qualities';

export const fetchInternetQualities = (): Promise<InternetQualityResponse> => fetchWrapper<InternetQualityResponse>(internetQualitiesUri);

const useInternetQualities = ({ enabled = true, onlyActive = true, sort = true }: UseInternetQualitiesOptions = {}): UseQueryResult<InternetQualityResponse, unknown> => {
  return useQuery(internetQualitiesQueryKey, fetchInternetQualities, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.internetQualities = data._embedded.internetQualities.filter((internetQuality) => {
          const active = internetQuality.activationDate ? beforeNow(new Date(internetQuality.activationDate)) : true;
          const expired = internetQuality.expirationDate ? beforeNow(new Date(internetQuality.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.internetQualities = data._embedded.internetQualities.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useInternetQualities;
