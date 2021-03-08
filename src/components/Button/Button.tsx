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

const Button = ({ className, color, disabled, children, onClick, outline }: ButtonProps): JSX.Element => {
  const defaultClasses = `tw-bg-${color}-600 hover:tw-bg-${color}-700 tw-text-white tw-font-semibold tw-py-2 tw-px-4 tw-border tw-border-${color}-700 tw-rounded`;
  const outlineClasses = `tw-bg-transparent hover:tw-bg-${color}-700 tw-text-${color}-700 tw-font-semibold hover:tw-text-white tw-py-2 tw-px-4 tw-border tw-border-${color}-700 hover:tw-border-transparent tw-rounded`;
  const disabledClasses = `tw-opacity-50 tw-cursor-not-allowed`;

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${outline ? outlineClasses : defaultClasses} ${disabled ? disabledClasses : null} ${className}`}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  color: TailwindColor.green,
};

export default Button;
