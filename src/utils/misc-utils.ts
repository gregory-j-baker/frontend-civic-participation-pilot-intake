/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import preval from 'preval.macro';

export const getApplicationVersion = (): string => preval`
  module.exports = require("../../package.json").version;
`;

export const getDateModified = (): string => preval`
  module.exports = new Date().toISOString();
`;

export const getGitCommit = (): string => preval`
  module.exports = require("child_process")
    .execSync("git rev-parse HEAD")
    .toString().substring(0, 8);
`;

export const sleep = (ms: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, ms));
