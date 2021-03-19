/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { apiConfig } from '../../../config';

export interface ContactUsData {
  email: string;
  message: string;
  name: string;
  phoneNumber?: string;
}

export const uri = `${apiConfig.baseUri}/contact-form`;

export const useSubmitContactUs = (options?: UseMutationOptions<void, HttpClientResponseError, ContactUsData>): UseMutationResult<void, HttpClientResponseError, ContactUsData> => {
  return useMutation(async (contactUsData): Promise<void> => {
    const response = await fetch(uri, {
      body: JSON.stringify(contactUsData),
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
