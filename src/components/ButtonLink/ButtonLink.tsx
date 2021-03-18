/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link, { LinkProps } from 'next/link';
import { TailwindColor } from '../../common/types';

export interface ButtonLinkProps extends LinkProps {
  className?: string;
  color?: TailwindColor;
  disabled?: boolean;
  children: React.ReactNode;
  outline?: boolean;
}

const ButtonLink = (props: ButtonLinkProps): JSX.Element => {
  const color = props.color ?? TailwindColor.green;
  const commonClasses = 'tw-font-semibold tw-py-2 tw-px-4 tw-border tw-rounded tw-no-underline visited:tw-no-underline hover:tw-no-underline focus:tw-no-underline';
  const defaultClasses = `${commonClasses} tw-bg-${color}-600 hover:tw-bg-${color}-700 tw-text-white visited:tw-text-white hover:tw-text-white active:tw-text-white tw-border-${color}-700 tw-shadow-sm`;
  const outlineClasses = `${commonClasses} tw-bg-transparent hover:tw-bg-${color}-700 tw-text-${color}-700 visited:tw-text-${color}-700 hover:tw-text-white active:tw-text-white tw-border-${color}-700`;
  const disabledClasses = `tw-opacity-50 tw-cursor-not-allowed`;

  return (
    <Link {...(props as LinkProps)} href={props.disabled ? '' : props.href} passHref={true}>
      <a className={`${props.outline ? outlineClasses : defaultClasses} ${props.disabled ? disabledClasses : ''} ${props.className ?? ''}`}>{props.children}</a>
    </Link>
  );
};

export default ButtonLink;
