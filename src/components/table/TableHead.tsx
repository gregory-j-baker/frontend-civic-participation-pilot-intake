/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHead = ({ children, className }: TableHeadProps): JSX.Element => {
  return <thead className={`tw-bg-gray-50 ${className ?? ''}`}>{children}</thead>;
};
