/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Page } from '../../common/types';

export interface TablePaginationProps {
  className?: string;
  page: Page;
}

export const TablePagination = ({ className, page }: TablePaginationProps): JSX.Element => {
  const { pathname, query } = useRouter();
  const { t } = useTranslation();

  return (
    <div className={`tw-bg-white tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 ${className}`}>
      <div className="tw-hidden sm:tw-block">
        <div className="tw-text-sm tw-text-gray-700 tw-hidden sm:tw-block">
          <Trans
            i18nKey="common:pagination.info"
            components={{ label: <span className="tw-font-bold" /> }}
            values={{
              start: (page.number - 1) * page.size + 1,
              end: page.number === page.totalPages ? page.totalElements : page.number * page.size,
              total: page.totalElements,
            }}
          />
        </div>
      </div>
      <div className="tw-flex tw-items-center tw-justify-between tw-space-x-4">
        {page.number > 1 && (
          <Link
            href={{
              pathname,
              query: { ...query, page: page.number - 1 },
            }}
            passHref>
            <a className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-bold tw-no-underline hover:tw-no-underline focus:tw-no-underline tw-rounded-md tw-text-gray-700 visited:tw-text-gray-700 tw-bg-white hover:tw-text-gray-500 focus:tw-text-gray-500">
              {t('common:pagination.previous')}
            </a>
          </Link>
        )}
        {page.number < page.totalPages && (
          <Link
            href={{
              pathname,
              query: { ...query, page: page.number + 1 },
            }}
            passHref>
            <a className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-bold tw-no-underline hover:tw-no-underline focus:tw-no-underline tw-rounded-md tw-text-gray-700 visited:tw-text-gray-700 tw-bg-white hover:tw-text-gray-500 focus:tw-text-gray-500">
              {t('common:pagination.next')}
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};
