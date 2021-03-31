/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody = ({ children, className }: TableBodyProps): JSX.Element => {
  return <tbody className={`tw-bg-white tw-divide-y tw-divide-gray-200 ${className}`}>{children}</tbody>;
};
