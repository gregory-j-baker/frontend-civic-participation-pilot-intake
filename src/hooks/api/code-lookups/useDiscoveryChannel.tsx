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
import { DiscoveryChannel, discoveryChannelsQueryKey, discoveryChannelsUri } from './types';

export const fetchDiscoveryChannel = (discoveryChannelId: string): Promise<DiscoveryChannel | null> => {
  return fetchWrapperNotFound<DiscoveryChannel>(`${discoveryChannelsUri}/${discoveryChannelId}`);
};

export const useDiscoveryChannel = (discoveryChannelId: string): UseQueryResult<DiscoveryChannel | null, HttpClientResponseError> => {
  return useQuery([discoveryChannelsQueryKey, discoveryChannelId], () => fetchDiscoveryChannel(discoveryChannelId), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
