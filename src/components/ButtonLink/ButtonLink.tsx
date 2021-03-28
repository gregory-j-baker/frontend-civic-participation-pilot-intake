/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link, { LinkProps } from 'next/link';
import { useMemo } from 'react';
import { TailwindColor } from '../../common/types';

export interface ButtonLinkProps extends LinkProps {
  className?: string;
  color?: TailwindColor;
  disabled?: boolean;
  children: React.ReactNode;
  outline?: boolean;
}

export type GetColorClassesFunc = (color: TailwindColor) => { defaultColorClasses: string; outlineClasses: string };

export const getColorClasses: GetColorClassesFunc = (color) => {
  switch (color) {
    case TailwindColor.blue:
      return {
        defaultColorClasses: 'tw-bg-blue-600 hover:tw-bg-blue-700 focus:tw-bg-blue-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-blue-700',
        outlineClasses: 'hover:tw-bg-blue-700 focus:tw-bg-blue-700 tw-text-blue-700 visited:tw-text-blue-70 hover:tw-text-white tw-border-blue-700',
      };

    case TailwindColor.gray:
      return {
        defaultColorClasses: 'tw-bg-gray-600 hover:tw-bg-gray-700 focus:tw-bg-gray-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-gray-700',
        outlineClasses: 'hover:tw-bg-gray-700 focus:tw-bg-gray-700 tw-text-gray-700 visited:tw-gray-700 hover:tw-text-white tw-border-gray-700',
      };

    case TailwindColor.green:
      return {
        defaultColorClasses: 'tw-bg-green-700 hover:tw-bg-green-800 focus:tw-bg-green-800 tw-text-white visited:tw-text-white hover:tw-text-white focus:tw-text-white tw-border-green-800',
        outlineClasses: 'hover:tw-bg-green-800 focus:tw-bg-green-800 tw-text-green-800 visited:tw-green-800 hover:tw-text-white focus:tw-text-white tw-border-green-800',
      };
    case TailwindColor.indigo:
      return {
        defaultColorClasses: 'tw-bg-indigo-600 hover:tw-bg-indigo-700 focus:tw-bg-indigo-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-indigo-700',
        outlineClasses: 'hover:tw-bg-indigo-700 focus:tw-bg-indigo-700 tw-text-indigo-700 visited:tw-indigo-700 hover:tw-text-white tw-border-indigo-700',
      };
    case TailwindColor.pink:
      return {
        defaultColorClasses: 'tw-bg-pink-600 hover:tw-bg-pink-700 focus:tw-bg-pink-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-pink-700',
        outlineClasses: 'hover:tw-bg-pink-700 focus:tw-bg-pink-700 tw-text-pink-700 visited:tw-pink-700 hover:tw-text-white tw-border-pink-700',
      };
    case TailwindColor.purple:
      return {
        defaultColorClasses: 'tw-bg-purple-600 hover:tw-bg-purple-700 focus:tw-bg-purple-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-purple-700',
        outlineClasses: 'hover:tw-bg-purple-700 focus:tw-bg-purple-700 tw-text-purple-700 visited:tw-purple-700 hover:tw-text-white tw-border-purple-700',
      };
    case TailwindColor.red:
      return {
        defaultColorClasses: 'tw-bg-red-600 hover:tw-bg-red-700 focus:tw-bg-red-700 tw-text-white visited:tw-text-white hover:tw-text-white tw-border-red-700',
        outlineClasses: 'hover:tw-bg-red-700 focus:tw-bg-red-700 tw-text-red-700 visited:tw-red-700 hover:tw-text-white tw-border-red-700',
      };
    case TailwindColor.white:
      return {
        defaultColorClasses: 'tw-bg-white hover:tw-bg-gray-100 focus:tw-bg-gray-100 tw-text-gray-600 tw-gray-600 visited:tw-gray-600 hover:tw-gray-600 tw-border-gray-600',
        outlineClasses: 'hover:tw-bg-gray-100 focus:tw-bg-gray-100 tw-text-gray-100 visited:tw-gray-100 hover:tw-gray-600 tw-border-gray-100',
      };
    case TailwindColor.yellow:
      return {
        defaultColorClasses: 'tw-bg-yellow-400 hover:tw-bg-yellow-500 focus:tw-bg-yellow-500 tw-text-black visited:tw-text-black hover:tw-text-black tw-border-yellow-500',
        outlineClasses: 'hover:tw-bg-yellow-500 focus:tw-bg-yellow-500 tw-text-yellow-500 visited:tw-yellow-500 hover:tw-text-black tw-border-yellow-500',
      };
  }

  return {
    defaultColorClasses: 'tw-bg-green-700 hover:tw-bg-green-800 focus:tw-bg-green-800 tw-text-white visited:tw-text-white hover:tw-text-white focus:tw-text-white tw-border-green-800',
    outlineClasses: 'hover:tw-bg-green-800 focus:tw-bg-green-800 tw-text-green-800 visited:tw-green-800 hover:tw-text-white focus:tw-text-white tw-border-green-800',
  };
};

export const ButtonLink = (props: ButtonLinkProps): JSX.Element => {
  const colorClasses = useMemo(() => getColorClasses(props.color ?? TailwindColor.green), [props.color]);

  const commonClasses = 'tw-font-semibold tw-py-2 tw-px-4 tw-border tw-rounded tw-no-underline hover:tw-no-underline focus:tw-no-underline';

  const defaultClasses = `${commonClasses} ${colorClasses.defaultColorClasses} `;
  const outlineClasses = `${commonClasses} tw-bg-transparent ${colorClasses.outlineClasses}`;
  const disabledClasses = `tw-opacity-50 tw-cursor-not-allowed`;

  return (
    <Link {...(props as LinkProps)} href={props.disabled ? '' : props.href} passHref={true}>
      <a className={`${props.outline ? outlineClasses : defaultClasses} ${props.disabled ? disabledClasses : ''} ${props.className ?? ''}`}>{props.children}</a>
    </Link>
  );
};
