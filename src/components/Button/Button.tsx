/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMemo } from 'react';
import { TailwindColor } from '../../common/types';

export interface ButtonOnClickEvent {
  (event: React.MouseEvent<HTMLButtonElement>): void;
}

export interface ButtonProps {
  className?: string;
  color?: TailwindColor;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: ButtonOnClickEvent;
  outline?: boolean;
}

export interface getColorClassesFunc {
  (color: TailwindColor): {
    defaultColorClasses: string;
    outlineClasses: string;
  };
}

const getColorClasses: getColorClassesFunc = (color) => {
  switch (color) {
    case TailwindColor.blue:
      return {
        defaultColorClasses: 'tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-border-blue-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-blue-700 tw-text-blue-700 hover:tw-text-white tw-border-blue-700',
      };

    case TailwindColor.gray:
      return {
        defaultColorClasses: 'tw-bg-gray-600 hover:tw-bg-gray-700 tw-text-white tw-border-gray-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-gray-700 tw-text-gray-700 hover:tw-text-white tw-border-gray-700',
      };

    case TailwindColor.green:
      return {
        defaultColorClasses: 'tw-bg-green-600 hover:tw-bg-green-700 tw-text-white tw-border-green-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-green-700 tw-text-green-700 hover:tw-text-white tw-border-green-700',
      };
    case TailwindColor.indigo:
      return {
        defaultColorClasses: 'tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-text-white tw-border-indigo-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-indigo-700 tw-text-indigo-700 hover:tw-text-white tw-border-indigo-700',
      };
    case TailwindColor.orange:
      return {
        defaultColorClasses: 'tw-bg-orange-600 hover:tw-bg-orange-700 tw-text-white tw-border-orange-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-orange-700 tw-text-orange-700 hover:tw-text-white tw-border-orange-700',
      };
    case TailwindColor.pink:
      return {
        defaultColorClasses: 'tw-bg-pink-600 hover:tw-bg-pink-700 tw-text-white tw-border-pink-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-pink-700 tw-text-pink-700 hover:tw-text-white tw-border-pink-700',
      };
    case TailwindColor.purple:
      return {
        defaultColorClasses: 'tw-bg-purple-600 hover:tw-bg-purple-700 tw-text-white tw-border-purple-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-purple-700 tw-text-purple-700 hover:tw-text-white tw-border-purple-700',
      };
    case TailwindColor.teal:
      return {
        defaultColorClasses: 'tw-bg-teal-600 hover:tw-bg-teal-700 tw-text-white tw-border-teal-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-teal-700 tw-text-teal-700 hover:tw-text-white tw-border-teal-700',
      };
    case TailwindColor.white:
      return {
        defaultColorClasses: 'tw-bg-white hover:tw-bg-gray-100 tw-text-gray-600 tw-border-gray-600',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-gray-100 tw-text-gray-600 tw-border-gray-600',
      };
    case TailwindColor.yellow:
      return {
        defaultColorClasses: 'tw-bg-yellow-600 hover:tw-bg-yellow-700 tw-text-white tw-border-yellow-700',
        outlineClasses: 'tw-bg-transparent hover:tw-bg-yellow-700 tw-text-yellow-700 hover:tw-text-white tw-border-yellow-700',
      };
  }

  return {
    defaultColorClasses: 'tw-bg-green-600 hover:tw-bg-green-700 tw-text-white tw-border-green-700',
    outlineClasses: 'tw-bg-transparent hover:tw-bg-green-700 tw-text-green-700 hover:tw-text-white tw-border-green-700',
  };
};

const Button = ({ className, color, disabled, children, onClick, outline }: ButtonProps): JSX.Element => {
  const colorClasses = useMemo(() => getColorClasses(color ?? TailwindColor.green), [color]);

  const defaultClasses = `${colorClasses.defaultColorClasses} tw-font-semibold tw-py-2 tw-px-4 tw-border tw-rounded-md tw-shadow-sm`;
  const outlineClasses = `tw-bg-transparent ${colorClasses.outlineClasses} tw-font-semibold tw-py-2 tw-px-4 tw-border hover:tw-border-transparent tw-rounded`;
  const disabledClasses = `tw-opacity-50 tw-cursor-not-allowed`;

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={` ${outline ? outlineClasses : defaultClasses} ${disabled ? disabledClasses : null} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
