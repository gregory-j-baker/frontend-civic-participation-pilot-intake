import { Translate } from 'next-translate';
import useTranslation from 'next-translate/useTranslation';
import { AriaAttributes } from 'react';

/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableHeadCellProps {
  ariaSort?: AriaAttributes['aria-sort'];
  children: React.ReactNode;
  className?: string;
  label: string;
  sortable?: boolean;
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

export const TableHeadCell = ({ ariaSort, children, className, label, sortable }: TableHeadCellProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <th
      scope="col"
      className={`tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-text-gray-500 tw-uppercase tw-tracking-wider ${className ?? ''}`}
      aria-sort={sortable ? ariaSort : undefined}
      aria-label={sortable ? `${label}: ${getSortLabel(ariaSort, t)}` : undefined}>
      {children}
    </th>
  );
};
