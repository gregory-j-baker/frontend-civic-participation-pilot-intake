/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { fetchWrapperNotFound } from '../../../utils/fetch-wrapper';
import { DiscoveryChannel, discoveryChannelsQueryKey, discoveryChannelsUri } from './types';

export const fetchDiscoveryChannel: QueryFunction<Promise<DiscoveryChannel | null>> = ({ queryKey }: QueryFunctionContext) => {
  const discoveryChannelId = queryKey[1] as string;
  return fetchWrapperNotFound<DiscoveryChannel>(`${discoveryChannelsUri}/${discoveryChannelId}`);
};

export const useDiscoveryChannel = (discoveryChannelId: string): UseQueryResult<DiscoveryChannel | null, HttpClientResponseError> => {
  return useQuery([discoveryChannelsQueryKey, discoveryChannelId], fetchDiscoveryChannel, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};
