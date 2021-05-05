import { Translate } from 'next-translate';
import useTranslation from 'next-translate/useTranslation';

/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
type AriaSort = 'none' | 'ascending' | 'descending' | 'other' | undefined;

export interface TableHeadCellProps {
  children: React.ReactNode;
  label: string;
  className?: string;
  ariaSort?: AriaSort;
}

// We do this for a11y, because screen readers don't always take
// "aria-sort: none" and indicate to the user it's a sortable
// column. The often ignore it. So we add this label to indicate
// the sort situation more verbosely to screen reader users.
const getSortLabel = (sort: AriaSort, t: Translate): string => {
  switch (sort) {
    case 'ascending':
      return t('application:management.list.sort.ascending');
    case 'descending':
      return t('application:management.list.sort.descending');
  }

  return t('application:management.list.sort.none');
};

export const TableHeadCell = ({ children, label, className, ariaSort }: TableHeadCellProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <th
      scope="col"
      className={`tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider ${className ?? ''}`}
      aria-sort={ariaSort ?? 'none'}
      aria-label={`${label}: ${ariaSort ? getSortLabel(ariaSort, t) : t('application:management.list.sort.undefined')}`}>
      {children}
    </th>
  );
};
