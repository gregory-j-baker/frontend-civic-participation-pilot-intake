/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { apiConfig } from '../../../config';

export interface EmailVerificationTokenData {
  accessToken: string;
}

export const useSubmitAccessToken = (options?: UseMutationOptions<void, HttpClientResponseError, EmailVerificationTokenData>): UseMutationResult<void, HttpClientResponseError, EmailVerificationTokenData> => {
  return useMutation(async (emailVerificationTokenData): Promise<void> => {
    const response = await fetch(`${apiConfig.baseUri}/email-validations/access-tokens`, {
      body: JSON.stringify(emailVerificationTokenData),
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
  }, options);
};
