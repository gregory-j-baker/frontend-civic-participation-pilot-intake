/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HateoasLink } from '../../common/types';
import { apiConfig } from '../../config';

/**
 * Disabilities
 */
export const disabilitiesQueryKey = 'disabilities';

export const disabilitiesUri = `${apiConfig.baseUri}/disabilities`;

export interface Disability {
  id: string;

  activationDate?: string;
  code: string;
  descriptionEn: string;
  descriptionFr: string;
  expirationDate?: string;
  uiDisplayOrderEn?: number;
  uiDisplayOrderFr?: number;

  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;

  _links: HateoasLink[];
}
