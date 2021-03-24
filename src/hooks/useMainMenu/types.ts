/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const mainMenuQueryKey = 'main-menu';

export interface MenuSubItem {
  href: string;
  text: string;
}

export interface MenuItem {
  id: string;
  text: string;
  href: string;
  items?: MenuSubItem[];
  mostRequestedItems?: MenuSubItem[];
}
