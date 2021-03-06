/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Session } from 'next-auth';
import { IncomingMessage } from 'node:http';

/**
 * Enum representing Tailwind CSS colors.
 * @see https://v1.tailwindcss.com/docs/customizing-colors#default-color-palette
 */
export enum TailwindColor {
  black = 'black',
  blue = 'blue',
  gray = 'gray',
  green = 'green',
  indigo = 'indigo',
  orange = 'orange',
  pink = 'pink',
  purple = 'purple',
  red = 'red',
  teal = 'teal',
  white = 'white',
  yellow = 'yellow',
}

/**
 * Type representing HATEOAS links. Note that this shape is specifc to Spring Boot's HATEOAS implementation.
 */
export interface HateoasCollection {
  _embedded: { [collectionName: string]: unknown };
  _links: [HateoasLink];
}

/**
 * Type representing HATEOAS links.
 * @see https://en.wikipedia.org/wiki/HATEOAS
 */
export interface HateoasLink {
  [rel: string]: {
    deprecation?: string;
    href: string;
    hrefLang?: string;
    media?: string;
    name?: string;
    profile?: string;
    title?: string;
    type?: string;
  };
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export enum Role {
  CPP_Administe = 'CivicParticipationProgram.Administer',
  CPP_Manage = 'CivicParticipationProgram.Manage',
}

export interface NextContext {
  req?: IncomingMessage;
  ctx?: { req: IncomingMessage };
}

export type SessionContext = NextContext & { triggerEvent?: boolean };

export interface AADSession extends Session {
  roles?: string[];
  accessTokenExpires: number;
}

/**
 * Sortable table column direction
 */
export enum Sorting {
  asc = 'asc',
  desc = 'desc',
}
