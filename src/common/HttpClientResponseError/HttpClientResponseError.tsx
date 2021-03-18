/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ValidationError {
  field: string;
  key: string;
  message: string;
}

export interface ResponseJson {
  validationErrors?: ValidationError[];
}

export class HttpClientResponseError extends Error {
  name = 'HttpClientResponseError';
  responseHeaders: Headers;
  responseStatus: number;
  responseStatusText: string;
  responseJson: any | undefined;
  responseText: string | undefined;

  constructor(response: Response, message: string, responseJson: ResponseJson | any | undefined, responseText: string | undefined) {
    super(message);

    this.responseHeaders = response.headers;
    this.responseStatus = response.status;
    this.responseStatusText = response.statusText;
    this.responseJson = responseJson;
    this.responseText = responseText;
  }

  getFieldError(field: string): ValidationError | undefined {
    return (this.responseJson as ResponseJson)?.validationErrors?.find?.((err) => err.field === field) ?? undefined;
  }
}
