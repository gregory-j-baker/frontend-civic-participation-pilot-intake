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
import { nlToLines } from '../../utils/misc-utils';
import { FormDefinitionListItem } from '../FormDefinitionListItem';

export interface ApplicationReviewProps {
  application: Application;
}

export const ApplicationHeader = ({ application }: ApplicationReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: applicationStatuses, isLoading: isApplicationStatusesLoading } = useApplicationStatuses({ lang });

  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const reasonTextLines = useMemo<string[]>(() => nlToLines(application.reasonText), [application.reasonText]);

  return (
    <>
      <h4 className="tw-font-bold tw-text-xl tw-m-0 tw-mb-8">{`${application.firstName} ${application.lastName}`}</h4>
      <dl>
        <FormDefinitionListItem
          even
          term={t('application:management.edit.application-status')}
          definition={!isApplicationStatusesLoading && getDescription(applicationStatuses?._embedded.applicationStatuses.find((obj) => obj.id === application.applicationStatusId) as ApplicationStatus)}
        />
        <FormDefinitionListItem term={t('application:management.edit.modified-date')} definition={dateTimeFormat.format(new Date(application.lastModifiedDate ?? application.createdDate))} />
        {application.lastModifiedDate && (
          <>
            <FormDefinitionListItem even term={t('application:management.edit.modified-by')} definition={application.lastModifiedBy} />
            <FormDefinitionListItem
              term={t('application:management.edit.reasoning')}
              definition={reasonTextLines.map((line, index) => (
                <p key={`${index} - ${line}`} className={`tw-m-0 ${index + 1 < reasonTextLines.length ? 'tw-mb-4' : ''}`}>
                  {line}
                </p>
              ))}
            />
          </>
        )}
      </dl>
    </>
  );
};
