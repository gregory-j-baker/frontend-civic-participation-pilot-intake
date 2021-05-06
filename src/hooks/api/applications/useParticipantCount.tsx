/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import type { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { SessionContext, AADSession } from '../../../common/types';
import { fetchWrapper } from '../../../utils/fetch-wrapper';
import { applicationsQueryKey, applicationsUri } from './types';

export interface ParticipantCountResponse {
  count: number;
}

export const fetchParticipantCount = async (context?: SessionContext): Promise<number> => {
  const session = (await getSession(context)) as AADSession;
  if (!session || Date.now() >= session.accessTokenExpires || !session.accessToken) Error('Invalid session');

  return fetchWrapper<number>(`${applicationsUri}/selected`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
};

// I know there's a way to make the callback optional, but out of time to fight with typescript, and only gets used on my
// page, so making it part of the function signature.
// We set these cache/stale values to that:
// A) It will never refetch the data while the user is sitting on the page (stale = infinite).
// B) It will ALWAYS refetch the data when the user navigates away/to the page (0 cache).
export const useParticipantCount = (successCallback: (data: number) => void): UseQueryResult<number, HttpClientResponseError> => {
  return useQuery<number, HttpClientResponseError>([applicationsQueryKey], () => fetchParticipantCount(), {
    onSuccess: (data) => successCallback(data),
    cacheTime: 0,
    staleTime: Infinity,
  });
};
