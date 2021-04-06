import React, { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { applicationConfig } from '../../../config';

export const AppDetails = (): JSX.Element => {
  const { t, lang } = useTranslation();
  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(`${lang}-CA`), [lang]);

  return (
    <div className="container tw-mb-8 tw-mt-10">
      <dl className="tw-grid tw-grid-rows-3 tw-grid-cols-2 tw-gap-2 tw-m-0 sm:tw-w-96">
        <dt className="tw-text-sm tw-font-normal tw-m-0">{t('common:app-details.date-modified')}</dt>
        <dd className="tw-text-sm tw-m-0">
          <time>{dateTimeFormat.format(new Date(applicationConfig.dateModified))}</time>
        </dd>
        <dt className="tw-text-sm tw-font-normal tw-m-0">{t('common:app-details.version')}</dt>
        <dd className="tw-text-sm tw-m-0">{applicationConfig.version}</dd>
        <dt className="tw-text-sm tw-font-normal tw-m-0">{t('common:app-details.git-commit')}</dt>
        <dd className="tw-text-sm tw-m-0">{applicationConfig.gitCommit}</dd>
      </dl>
    </div>
  );
};
