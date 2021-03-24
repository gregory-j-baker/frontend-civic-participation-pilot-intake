/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { QueryFunctionContext, UseQueryResult } from 'react-query';
import { useQuery, QueryFunction } from 'react-query';
import { mainMenuStaticPropsEn, mainMenuStaticPropsFr } from '.';
import { mainMenuQueryKey, MenuItem, MenuSubItem } from './types';
import { applicationConfig } from '../../config';
import xmlParser, { X2jOptionsOptional } from 'fast-xml-parser';
import { decodeXML, decodeHTML } from 'entities';

export interface UseMainMenuOptions {
  lang?: string;
}

export interface FetchMainMenuOptions {
  lang?: string;
}

export interface CanadaSiteMenuAnchor {
  href: string;
  role: string;
  text: string;
}
export interface CanadaSiteMenuUnorderedList {
  a: CanadaSiteMenuAnchor;
  id: string;
  li: CanadaSiteMenuListItem[];
}

export interface CanadaSiteMenuListItem {
  a?: CanadaSiteMenuAnchor;
  ul?: CanadaSiteMenuUnorderedList;
}

export interface CanadaSiteMenuJson {
  li?: CanadaSiteMenuListItem[];
}

export const fetchMainMenu: QueryFunction<Promise<MenuItem[]>> = async ({ queryKey }: QueryFunctionContext) => {
  const { lang } = queryKey[1] as FetchMainMenuOptions;

  try {
    const { canadaMenuUrl } = applicationConfig;
    const res = await fetch(lang === 'fr' ? canadaMenuUrl.fr : canadaMenuUrl.en);

    const xmlData = await res.text();

    const options: X2jOptionsOptional = {
      ignoreAttributes: false,
      parseAttributeValue: true,
      trimValues: true,
      textNodeName: 'text',
      attributeNamePrefix: '',
      attrValueProcessor: (val) => decodeXML(val),
      tagValueProcessor: (val) => decodeHTML(val),
    };

    const json = xmlParser.parse(xmlData, options) as CanadaSiteMenuJson;
    const rootMenuItems = json.li?.filter(({ a }) => a && a.role === 'menuitem') ?? [];

    return rootMenuItems.map<MenuItem>(({ a, ul }, idx) => {
      const itemsListItems: CanadaSiteMenuAnchor[] | undefined = ul?.li.filter(({ a, ul }) => a?.role === 'menuitem' && !ul).map(({ a }) => a as CanadaSiteMenuAnchor);

      // remove first item from the list for the MenuItem href
      const firstItemsListItem = itemsListItems?.shift();

      const mostRequestedItemsListItems: CanadaSiteMenuAnchor[] | undefined = ul?.li.find(({ a, ul }) => a?.role === 'menuitem' && ul)?.ul?.li.map(({ a }) => a as CanadaSiteMenuAnchor);

      return {
        id: ul?.id.replace('gc-mnu-', '') ?? `item-${idx}`,
        text: a?.text ?? `item-${idx}`,
        href: firstItemsListItem?.href ?? '#',
        items: itemsListItems?.map<MenuSubItem>(({ href, text }) => ({ href, text })),
        mostRequestedItems: mostRequestedItemsListItems?.map<MenuSubItem>(({ href, text }) => ({ href, text })),
      };
    });
  } catch (error) {
    return lang === 'fr' ? mainMenuStaticPropsFr : mainMenuStaticPropsEn;
  }
};

export const useMainMenu = ({ lang }: UseMainMenuOptions = { lang: 'en' }): UseQueryResult<MenuItem[], unknown> => {
  return useQuery([mainMenuQueryKey, { lang } as FetchMainMenuOptions], fetchMainMenu, { cacheTime: Infinity, staleTime: Infinity });
};
