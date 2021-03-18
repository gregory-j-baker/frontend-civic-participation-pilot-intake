/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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

const Button = (props: ButtonProps): JSX.Element => {
  const color = props.color ?? TailwindColor.green;
  const commonClasses = 'tw-font-semibold tw-py-2 tw-px-4 tw-border tw-rounded';
  const defaultClasses = `${commonClasses} tw-bg-${color}-600 hover:tw-bg-${color}-700 tw-text-white tw-border-${color}-700 tw-shadow-sm`;
  const outlineClasses = `${commonClasses} tw-bg-transparent hover:tw-bg-${color}-700 tw-text-${color}-700 hover:tw-text-white tw-border-${color}-700`;
  const disabledClasses = `tw-opacity-50 tw-cursor-not-allowed`;

  return (
    <button type="button" disabled={props.disabled} onClick={props.onClick} className={` ${props.outline ? outlineClasses : defaultClasses} ${props.disabled ? disabledClasses : ''} ${props.className ?? ''}`}>
      {props.children}
    </button>
  );
};

export default Button;
