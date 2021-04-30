/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useMemo } from 'react';
import { Application } from '../../hooks/api/applications/types';
import { ApplicationStatus } from '../../hooks/api/code-lookups/types';
import { useApplicationStatuses } from '../../hooks/api/code-lookups/useApplicationStatuses';
import { GetDescriptionFunc } from '../../pages/application/types';

export interface ApplicationReviewProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading } = useApplicationStatuses({ lang });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  return (
    <>
      <h4 className="tw-font-bold tw-text-xl tw-m-0 tw-mb-2">
        <span className="tw-block tw-mb-2">{`${application.firstName} ${application.lastName}`}</span>
      </h4>
      <span className="tw-block tw-mb-2 tw-font-medium tw-text-gray-500">
        {!isApplicationStatusesLoading && getDescription(applicationStatuses?._embedded.applicationStatuses.find((obj) => obj.id === application.applicationStatusId) as ApplicationStatus)} (
        {dateTimeFormat.format(new Date(application.lastModifiedDate ?? application.createdDate))})
      </span>
      {application.lastModifiedDate ? (
        <div className="tw-font-medium tw-text-gray-500">
          <span className="tw-block tw-mb-2">{`${t('application:management.edit.modified-by')} ${application.lastModifiedBy}`}</span>
          <span className="tw-block tw-mb-2">{t('application:management.edit.reasoning')}</span>
          <span className="tw-block tw-ml-4">{application.reasonText}</span>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
