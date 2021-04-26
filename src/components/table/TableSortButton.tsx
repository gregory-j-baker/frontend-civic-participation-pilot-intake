/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEventHandler } from 'react';
import { Sorting } from '../../common/types';

export type TableSortButtonOnClickEvent = (event: { field: string; nextSorting: Sorting }) => void;

export interface TableSortButtonProps {
  children: React.ReactNode;
  field: string;
  onClick: TableSortButtonOnClickEvent;
  sorting?: Sorting;
}

export const TableSortButton = ({ children, field, onClick, sorting }: TableSortButtonProps): JSX.Element => {
  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (event): void => {
    event.preventDefault();
    const nextSorting: Sorting = sorting === Sorting.asc ? Sorting.desc : Sorting.asc;
    onClick({ field, nextSorting });
  };

  return (
    <button className="tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider tw-flex tw-flex-nowrap tw-content-center tw-items-center" onClick={handleOnClick}>
      <span>{children}</span>
      {sorting === Sorting.asc && <span className="tw-ml-1 glyphicon glyphicon-sort-by-attributes" style={{ top: 0 }} aria-hidden="true" />}
      {sorting === Sorting.desc && <span className="tw-ml-1 glyphicon glyphicon-sort-by-attributes-alt" style={{ top: 0 }} aria-hidden="true" />}
      {sorting === undefined && <span className="tw-ml-1 glyphicon glyphicon-sort tw-opacity-60" style={{ top: 0 }} aria-hidden="true" />}
    </button>
  );
};
