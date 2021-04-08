/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableHeadCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeadCell = ({ children, className }: TableHeadCellProps): JSX.Element => {
  return (
    <th scope="col" className={`tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider ${className ?? ''}`}>
      {children}
    </th>
  );
};
