/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { TableCell } from './TableCell';

export interface TableRowNoDataProps {
  className?: string;
  colSpan?: number;
}

export const TableRowNoData = ({ className, colSpan }: TableRowNoDataProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <tr>
      <TableCell className={`tw-whitespace-nowrap tw-text-center ${className ?? ''}`} colSpan={colSpan}>
        {t('common:pagination.no-data')}
      </TableCell>
    </tr>
  );
};
