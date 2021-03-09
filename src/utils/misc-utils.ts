/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import preval from 'preval.macro';
import { ElementType } from 'react';

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

export const getPreviousElementSibling = (elem: Element, selector?: string | null): Element | null => {
  // Get the previous sibling element
  let sibling = elem.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the previous sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }

  return null;
};

export const getNextElementSibling = (elem: Element, selector?: string | null): Element | null => {
  // Get the next sibling element
  let sibling = elem.nextElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }

  return null;
};

export const getYears = ({ startYear, endYear }: { startYear?: number; endYear?: number }): number[] => {
  const currentYear = new Date().getFullYear();

  const years = [];

  let year = startYear || currentYear - 50;

  while (year <= (endYear ?? currentYear)) {
    years.push(year++);
  }

  return years;
};
