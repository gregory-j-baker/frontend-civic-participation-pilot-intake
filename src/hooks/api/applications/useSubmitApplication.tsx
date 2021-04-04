/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { QueryClient, useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { applicationsQueryKey, ApplicationSubmitData, applicationsUri } from './types';

export const useSubmitApplication = (options?: UseMutationOptions<void, HttpClientResponseError, ApplicationSubmitData>): UseMutationResult<void, HttpClientResponseError, ApplicationSubmitData> => {
  return useMutation(async (applicationData): Promise<void> => {
    const response = await fetch(applicationsUri, {
      body: JSON.stringify(applicationData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
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
