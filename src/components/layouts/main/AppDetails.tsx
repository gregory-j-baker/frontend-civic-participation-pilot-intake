import React, { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { applicationConfig } from '../../../config';

export const AppDetails = (): JSX.Element => {
  const { t, lang } = useTranslation();
  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  return (
    <div className="container tw-mb-8">
      <dl className="tw-grid tw-grid-cols-2 tw-gap-x-4 tw-gap-y-1 tw-m-0 tw-w-max">
        <dt className="tw-m-0 tw-font-normal">{t('common:app-details.date-modified')}</dt>
        <dd className="tw-m-0">
          <time property="dateModified">{dateTimeFormat.format(new Date(applicationConfig.dateModified))}</time>
        </dd>
        <dt className="tw-m-0 tw-font-normal">{t('common:app-details.version')}</dt>
        <dd className="tw-m-0">{`${applicationConfig.version}-${applicationConfig.gitCommit}`}</dd>
      </dl>
    </div>
  );
};
