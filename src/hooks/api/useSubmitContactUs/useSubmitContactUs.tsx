/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMutation, UseMutationResult } from 'react-query';
import { apiConfig } from '../../../config';
import { fetchWrapper } from '../../../utils/fetch-wrapper';

export interface ContactUsData {
  email: string;
  message: string;
  name: string;
  phoneNumber?: string;
}

export const uri = `${apiConfig.baseUri}/contact-form`;

const useSubmitContactUs = (): UseMutationResult<Response, unknown, ContactUsData> => {
  return useMutation((contactUsData: ContactUsData) =>
    fetchWrapper<any>(uri, {
      body: JSON.stringify(contactUsData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  );
};

export default useSubmitContactUs;
