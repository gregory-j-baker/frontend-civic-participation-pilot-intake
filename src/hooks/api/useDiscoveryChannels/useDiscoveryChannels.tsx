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

export interface DiscoveryChannel {
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

export interface DiscoveryChannelResponse extends HateoasCollection {
  _embedded: {
    discoveryChannels: DiscoveryChannel[];
  };
}

export interface UseDiscoveryChannelsOptions {
  enabled?: boolean;
  onlyActive?: boolean;
  sort?: boolean;
}

export const uri = `${apiConfig.baseUri}/discovery-channels`;

export const fetchDiscoveryChannels = (): Promise<DiscoveryChannelResponse> => fetch(uri).then((res) => res.json());

const useDiscoveryChannels = ({ enabled = true, onlyActive = true, sort = true }: UseDiscoveryChannelsOptions = {}): UseQueryResult<DiscoveryChannelResponse, unknown> => {
  return useQuery('discovery-channels', fetchDiscoveryChannels, {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (onlyActive) {
        data._embedded.discoveryChannels = data._embedded.discoveryChannels.filter((discoveryChannel) => {
          const active = discoveryChannel.activationDate ? beforeNow(new Date(discoveryChannel.activationDate)) : true;
          const expired = discoveryChannel.expirationDate ? beforeNow(new Date(discoveryChannel.expirationDate)) : false;
          return active && !expired;
        });
      }

      if (sort) {
        data._embedded.discoveryChannels = data._embedded.discoveryChannels.sort((a, b) => (a.uiDisplayOrder ?? 0) - (b.uiDisplayOrder ?? 0));
      }
    },
  });
};

export default useDiscoveryChannels;
