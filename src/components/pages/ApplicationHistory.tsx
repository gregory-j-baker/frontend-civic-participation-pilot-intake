/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useTranslation from 'next-translate/useTranslation';
import { TableWrapper } from '../table/TableWrapper';
import { Table } from '../table/Table';
import { TableHead } from '../table/TableHead';
import { TableBody } from '../table/TableBody';
import { TableHeadCell } from '../table/TableHeadCell';
import { TableCell } from '../table/TableCell';
import { TableRowNoData } from '../table/TableRowNoData';
import { PageLoadingSpinner } from '../../components/PageLoadingSpinner';
import { useCallback, useMemo } from 'react';
import { useApplicationStatuses } from '../../hooks/api/code-lookups/useApplicationStatuses';
import { ApplicationStatus } from '../../hooks/api/code-lookups/types';
import { GetDescriptionFunc } from '../../pages/application/types';
import { useApplicationStatusHistories } from '../../hooks/api/applications/useApplicationStatusHistories';

export interface ApplicationStatusHistoryProps {
  applicationId: string;
}

export const ApplicationHistory = ({ applicationId }: ApplicationStatusHistoryProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: applicationStatusHistoriesResponse, isLoading: isApplicationStatusHistoriesLoading } = useApplicationStatusHistories(applicationId, { sort: ['lastModifiedDate,desc'] });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  const { data: applicationStatuses } = useApplicationStatuses({ lang });

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  return (
    <>
      <h4 className="tw-font-bold tw-text-xl tw-m-0 tw-mb-8">{t('application:management.edit.history.title')}</h4>
      {isApplicationStatusHistoriesLoading ? (
        <PageLoadingSpinner />
      ) : (
        <TableWrapper>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell>{t('application:management.edit.history.table-header.status')}</TableHeadCell>
                <TableHeadCell className="tw-w-2/4">{t('application:management.edit.history.table-header.reasoning')}</TableHeadCell>
                <TableHeadCell>{t('application:management.edit.history.table-header.modified-by')}</TableHeadCell>
                <TableHeadCell>{t('application:management.edit.history.table-header.modified-date')}</TableHeadCell>
              </tr>
            </TableHead>
            {applicationStatusHistoriesResponse && (
              <TableBody>
                {applicationStatusHistoriesResponse._embedded.applicationStatusHistories.length > 0 ? (
                  applicationStatusHistoriesResponse._embedded.applicationStatusHistories.map((applicationStatusHistory) => (
                    <tr key={applicationStatusHistory.id}>
                      <TableCell className="tw-px-4 tw-py-2 tw-whitespace-nowrap">
                        {applicationStatuses && getDescription(applicationStatuses._embedded.applicationStatuses.find((obj) => obj.id === applicationStatusHistory.applicationStatusId) as ApplicationStatus)}
                      </TableCell>
                      <TableCell className="tw-flex-wrap">{applicationStatusHistory.reasonText}</TableCell>
                      <TableCell>{applicationStatusHistory.lastModifiedBy}</TableCell>
                      <TableCell>{applicationStatusHistory.lastModifiedDate ? dateTimeFormat.format(new Date(applicationStatusHistory.lastModifiedDate)) : ''}</TableCell>
                    </tr>
                  ))
                ) : (
                  <TableRowNoData colSpan={4} />
                )}
              </TableBody>
            )}
          </Table>
        </TableWrapper>
      )}
    </>
  );
};
