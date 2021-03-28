/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';

export enum AlertType {
  danger,
  default,
  info,
  success,
  warning,
}

export interface AlertProps {
  description?: string;
  children?: React.ReactNode;
  title: string;
  type?: AlertType;
}

export type GetColorClassesFunc = (alertType: AlertType) => { rootColorClasses: string; iconColorClasses: string };

export const getColorClasses: GetColorClassesFunc = (alertType) => {
  switch (alertType) {
    case AlertType.danger:
      return {
        rootColorClasses: 'tw-bg-red-50 tw-border-red-600',
        iconColorClasses: 'tw-text-red-600',
      };

    case AlertType.info:
      return {
        rootColorClasses: 'tw-bg-blue-50 tw-border-blue-600',
        iconColorClasses: 'tw-text-blue-600',
      };

    case AlertType.success:
      return {
        rootColorClasses: 'tw-bg-green-50 tw-border-green-600',
        iconColorClasses: 'tw-text-green-600',
      };

    case AlertType.warning:
      return {
        rootColorClasses: 'tw-bg-yellow-50 tw-border-yellow-600',
        iconColorClasses: 'tw-text-yellow-600',
      };
  }

  return {
    rootColorClasses: 'tw-bg-gray-50 tw-border-gray-600',
    iconColorClasses: 'tw-text-gray-600',
  };
};

export const Alert = ({ children, description, title, type }: AlertProps): JSX.Element => {
  const colorClasses = useMemo(() => getColorClasses(type ?? AlertType.default), [type]);

  return (
    <section className={`${colorClasses.rootColorClasses} tw-border-l-4 tw-rounded tw-px-4 tw-py-2 tw-shadow tw-mb-8`} role="alert" tabIndex={-1}>
      <div className="tw-flex-col">
        <div className="tw-flex md:tw-items-center">
          <div className={`tw-h-10 tw-w-10 tw-mr-4 tw-flex-shrink-0`}>
            <svg className={`${colorClasses.iconColorClasses} tw-fill-current tw-w-full`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          {title && <h2 className="tw-text-2xl tw-font-bold tw-m-0">{title}</h2>}
        </div>

        {(description || children) && (
          <div className="tw-ml-14 tw-mt-4">
            {description && <p className={`tw-m-0 ${children ? 'tw-mb-6' : ''}`}>{description}</p>}
            {children && <div>{children}</div>}
          </div>
        )}
      </div>
    </section>
  );
};
