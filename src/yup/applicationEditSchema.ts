/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Yup from 'yup';
import './yup-custom';

export const applicationEditSchema = Yup.object().shape({
  applicationStatusId: Yup.string().required(),
  reasoning: Yup.string().required(),
});
