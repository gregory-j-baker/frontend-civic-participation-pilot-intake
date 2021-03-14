/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HttpClientResponseError } from '../common/HttpClientResponseError';

/**
 * Usage with fetch and others clients that do not throw by default
 * @see https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-others-clients-that-do-not-throw-by-default
 */
export const fetchWrapper = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    let responseJson: any | undefined = undefined;
    response.json().then((data) => (responseJson = data));

    let responseText: string | undefined = undefined;
    response.text().then((data) => (responseText = data));

    throw new HttpClientResponseError(response, undefined, responseJson, responseText);
  }

  return response.json();
};
