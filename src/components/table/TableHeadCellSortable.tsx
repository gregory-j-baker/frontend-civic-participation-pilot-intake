import { Translate } from 'next-translate';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { AriaAttributes } from 'react';
import { Sorting } from '../../common/types';

/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableHeadCellSortableProps {
  children: React.ReactNode;
  className?: string;
  label: string;
  field: string;
}

// We do this for a11y, because screen readers don't always take
// "aria-sort: none" and indicate to the user it's a sortable
// column. The often ignore it. So we add this label to indicate
// the sort situation more verbosely to screen reader users.
const getSortLabel = (sort: AriaAttributes['aria-sort'], t: Translate): string => {
  switch (sort) {
    case 'ascending':
      return t('application:management.list.sort.descending-instruction');
    case 'descending':
      return t('application:management.list.sort.ascending-instruction');
  }

  return t('application:management.list.sort.ascending-instruction');
};

export const TableHeadCellSortable = ({ children, className, label, field }: TableHeadCellSortableProps): JSX.Element => {
  const { t } = useTranslation();

  const router = useRouter();
  const { query, pathname } = router;

  const getCurrentSorting = (field: string): Sorting | undefined => {
    // if no sort, default to createdDate,desc
    return query.sort ? (query.sort.indexOf(field) > -1 ? (query.sort.indexOf(Sorting.asc) > -1 ? Sorting.asc : Sorting.desc) : undefined) : field === 'createdDate' ? Sorting.desc : undefined;
  };

  const getAriaSort = (field: string): AriaAttributes['aria-sort'] => {
    const currentSort = getCurrentSorting(field);

    if (!currentSort) return undefined;
    else if (currentSort == Sorting.asc) return 'ascending';

    return 'descending';
  };

  const handleSort = (field: string): void => {
    const currentSort = getCurrentSorting(field);
    const nextSorting: Sorting = currentSort === Sorting.asc ? Sorting.desc : Sorting.asc;
    router.push({ pathname, query: { ...query, sort: `${field},${nextSorting}` } });
  };

  const ariaSort = getAriaSort(field);

  return (
    <th scope="col" role="columnheader" className={`tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider ${className ?? ''}`} aria-sort={ariaSort}>
      <button tabIndex={0} onClick={() => handleSort(field)} aria-label={`${label}: ${getSortLabel(ariaSort, t)}`}>
        <span className="tw-flex tw-space-x-1">
          <div>{children}</div>
          <div>
            {ariaSort === 'ascending' && <span className="glyphicon glyphicon-sort-by-attributes" />}
            {ariaSort === 'descending' && <span className="glyphicon glyphicon-sort-by-attributes-alt" />}
            {ariaSort === undefined && <span className="glyphicon glyphicon-sort" />}
          </div>
        </span>
      </button>
    </th>
  );
};
