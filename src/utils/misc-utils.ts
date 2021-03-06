/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import preval from 'preval.macro';

export const getApplicationVersion = (): string => preval`
  module.exports = require("../../package.json").version;
`;

export const getDateModified = (): string => preval`
  module.exports =  require("child_process")
  .execSync("git log -n 1 HEAD --date=iso-strict --format=%ad")
  .toString().slice(0, -1);
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

/**
 * Gets keyboard-focusable elements within a specified element
 * @see https://zellwk.com/blog/keyboard-focusable-elements/
 */
export const getKeyboardFocusableElements = (element?: Element): Element[] => {
  const el = element ?? document;
  return [...el.querySelectorAll('a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute('disabled'));
};

export const nlToLines = (text?: string, removeEmptyLines = true): string[] => {
  if (!text) return [];
  return text.split('\n').filter((line) => (removeEmptyLines ? line?.length > 0 : true));
};
