/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { apiConfig } from '../../../config';
import { fetchWrapper } from '../../../utils/fetch-wrapper';

export interface EmailVerificationAccessCodeData {
  email: string;
  accessCode: string;
}

export interface EmailVerificationResponse {
  message: '';
  verificationCount: 0;
}

export const uri = `${apiConfig.baseUri}/email-validations/accessCodes`;

export const useSubmitAccessCode = (
  options?: UseMutationOptions<EmailVerificationResponse, HttpClientResponseError, EmailVerificationAccessCodeData>
): UseMutationResult<EmailVerificationResponse, HttpClientResponseError, EmailVerificationAccessCodeData> => {
  return useMutation(
    (emailVerificationAccessCodeData) =>
      fetchWrapper<EmailVerificationResponse>(uri, {
        body: JSON.stringify(emailVerificationAccessCodeData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    options
  );
};
