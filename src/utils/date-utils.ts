/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const afterNow = (date: Date): boolean => {
  return date > new Date();
};

export const beforeNow = (date: Date): boolean => {
  return date < new Date();
};
