/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface IButtonOnClickEvent {
  (event: React.MouseEvent<HTMLButtonElement>): void;
}

export interface IButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: IButtonOnClickEvent;
}

const Button = ({ disabled, children, onClick }: IButtonProps): JSX.Element => {
  const rootClasses = 'tw-border tw-text-white tw-rounded-md tw-px-6 tw-py-4 tw-transition tw-duration-500 tw-ease tw-select-none focus:tw-outline-none focus:tw-shadow-outline';
  const defaultClasses = `${rootClasses} tw-border-green-600 tw-bg-green-600 hover:tw-bg-green-700`;
  const disabledClasses = `${rootClasses} tw-border-green-300 tw-bg-green-300`;

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={disabled ? disabledClasses : defaultClasses} style={{ fontSize: '0.875em' }}>
      {children}
    </button>
  );
};

Button.propTypes = {};

export default Button;
