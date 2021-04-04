/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { HateoasCollection } from '../../../common/types';
import { beforeNow } from '../../../utils/date-utils';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { DiscoveryChannel, discoveryChannelsQueryKey, discoveryChannelsUri } from './types';

export interface DiscoveryChannelsResponse extends HateoasCollection {
  _embedded: {
    discoveryChannels: DiscoveryChannel[];
  };
}

export interface FetchDiscoveryChannelsOptions {
  lang?: string;
  onlyActive?: boolean;
}

export interface UseDiscoveryChannelsOptions extends FetchDiscoveryChannelsOptions {
  enabled?: boolean;
}

export const fetchDiscoveryChannels = async (options: FetchDiscoveryChannelsOptions): Promise<DiscoveryChannelsResponse> => {
  const { lang, onlyActive } = options;

  const queries: string[] = [`sort=${lang && lang === 'fr' ? nameof<DiscoveryChannel>((o) => o.uiDisplayOrderFr) : nameof<DiscoveryChannel>((o) => o.uiDisplayOrderEn)}`];

  const data = await fetchWrapper<DiscoveryChannelsResponse>(`${discoveryChannelsUri}?${queries.join('&')}`);

  if (onlyActive) {
    data._embedded.discoveryChannels = data._embedded.discoveryChannels.filter((discoveryChannel) => {
      const active = discoveryChannel.activationDate ? beforeNow(new Date(discoveryChannel.activationDate)) : true;
      const expired = discoveryChannel.expirationDate ? beforeNow(new Date(discoveryChannel.expirationDate)) : false;
      return active && !expired;
    });
  }

  return data;
};

export const useDiscoveryChannels = (options: UseDiscoveryChannelsOptions = { enabled: true, lang: 'en', onlyActive: true }): UseQueryResult<DiscoveryChannelsResponse, HttpClientResponseError> => {
  const { enabled } = options;
  return useQuery([discoveryChannelsQueryKey, options], () => fetchDiscoveryChannels(options), {
    enabled,
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
