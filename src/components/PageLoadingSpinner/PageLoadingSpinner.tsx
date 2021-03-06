/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';

import styles from './PageLoadingSpinner.module.css';

const PageLoadingSpinner = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-justify-center">
      <div className={`${styles.pageLoadingSpinner} tw-ease-linear tw-rounded-full tw-border-4 tw-border-t-4 tw-border-gray-200 tw-h-12 tw-w-12 tw-mb-4`} />
      <h2 className="tw-m-0 tw-text-center tw-text-xl tw-font-bold">{t('common:loading.header')}</h2>
      <p className="tw-w-3/4 md:tw-w-2/3 tw-text-center">{t('common:loading.description')}</p>
    </div>
  );
};

export default PageLoadingSpinner;
