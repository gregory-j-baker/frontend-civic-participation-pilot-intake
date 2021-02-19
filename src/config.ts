/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import type { ThemeOptions } from '@material-ui/core';
import { getApplicationVersion, getDateModified, getGitCommit } from './utils/misc-utils';

/**
 * Application specific configuration.
 */
export const applicationConfig = {
  dateModified: getDateModified(),
  gitCommit: getGitCommit(),
  version: getApplicationVersion(),
};

/**
 * Material-ui specific theme
 */
export const muiThemeConfig: ThemeOptions = {
  palette: {
    type: 'dark',
  },
};
