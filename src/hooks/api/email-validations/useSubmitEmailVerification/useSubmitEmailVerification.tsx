/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../../common/HttpClientResponseError';
import { apiConfig } from '../../../../config';
import { fetchWrapper } from '../../../../utils/fetch-wrapper';

export interface EmailVerificationData {
  email: string;
  accessCode: string;
}

export interface EmailVerificationResponse {
  message: '';
  verificationCount: 0;
}

export const uri = `${apiConfig.baseUri}/email-validations/access-codes`;

export const useSubmitEmailVerification = (options?: UseMutationOptions<EmailVerificationResponse, HttpClientResponseError, EmailVerificationData>): UseMutationResult<EmailVerificationResponse, HttpClientResponseError, EmailVerificationData> => {
  return useMutation(
    (emailVerificationData) =>
      fetchWrapper<EmailVerificationResponse>(uri, {
        body: JSON.stringify(emailVerificationData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    options
  );
};
