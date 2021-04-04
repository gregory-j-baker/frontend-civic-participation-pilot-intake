/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import { useMutation, UseMutationOptions, UseMutationResult, QueryClient } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { AADSession } from '../../../common/types';
import { applicationsQueryKey, applicationsUri } from './types';

export interface SaveApplicationData {
  id: string;
  applicationStatusId: string;
  reasonText: string;
}

export const useSaveApplication = (options?: UseMutationOptions<void, HttpClientResponseError, SaveApplicationData>): UseMutationResult<void, HttpClientResponseError, SaveApplicationData> => {
  return useMutation(async (saveApplicationData): Promise<void> => {
    const session = (await getSession()) as AADSession;
    if (!session || Date.now() >= session.accessTokenExpires || !session.accessToken) Error('Invalid session');

    const response = await fetch(`${applicationsUri}/${saveApplicationData.id}`, {
      body: JSON.stringify({
        applicationStatusId: saveApplicationData.applicationStatusId,
        reasonText: saveApplicationData.reasonText,
      }),
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });

    if (!response.ok) {
      const responseJson = await response
        .clone()
        .json()
        .catch(() => undefined);

      const responseText = await response
        .clone()
        .text()
        .catch(() => undefined);

      throw new HttpClientResponseError(response, 'Network response was not ok', responseJson, responseText);
    }

    // on mutation succeeds, invalidate any queries
    const queryClient = new QueryClient();
    await queryClient.invalidateQueries(applicationsQueryKey);
  }, options);
};
