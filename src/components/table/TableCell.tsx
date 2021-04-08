/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableCellProps {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}

export const TableCell = ({ children, colSpan, className }: TableCellProps): JSX.Element => {
  return (
    <td className={`tw-px-4 tw-py-2 tw-text-sm ${className ?? ''}`} colSpan={colSpan}>
      {children}
    </td>
  );
};
