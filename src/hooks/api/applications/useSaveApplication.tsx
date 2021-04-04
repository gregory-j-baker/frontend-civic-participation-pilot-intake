/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getSession } from 'next-auth/client';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import type { AADSession, SessionContext } from '../../../common/types';
import { Application, SaveApplicationData, applicationsUri } from './types';

export interface ApplicationResponse {
  application: Application;
}

export interface UpdateStatusData {
  applicationStatusId: string;
  reasonText: string;
}

export const saveApplication = async (applicationId: string, saveApplicationData: SaveApplicationData, context?: SessionContext): Promise<void> => {
  const session = (await getSession(context)) as AADSession;
  if (!session || Date.now() >= session.accessTokenExpires || !session.accessToken) Error('Invalid session');

  const response = await fetch(`${applicationsUri}/${applicationId}`, {
    body: JSON.stringify(saveApplicationData),
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
};

export const useSaveApplication = (applicationId: string, context?: SessionContext, options?: UseMutationOptions<void, HttpClientResponseError, SaveApplicationData>): UseMutationResult<void, HttpClientResponseError, SaveApplicationData> => {
  return useMutation((saveApplicationData) => saveApplication(applicationId, saveApplicationData), options);
};
