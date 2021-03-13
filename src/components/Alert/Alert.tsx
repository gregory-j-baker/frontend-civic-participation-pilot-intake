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

export interface getColorClassesFunc {
  (alertType: AlertType): {
    rootColorClasses: string;
    iconColorClasses: string;
  };
}

const getColorClasses: getColorClassesFunc = (alertType) => {
  switch (alertType) {
    case AlertType.danger:
      return {
        rootColorClasses: 'tw-bg-red-100 tw-border-red-500 tw-text-red-900',
        iconColorClasses: 'tw-text-red-500',
      };

    case AlertType.info:
      return {
        rootColorClasses: 'tw-bg-blue-100 tw-border-blue-500 tw-text-blue-900',
        iconColorClasses: 'tw-text-blue-500',
      };

    case AlertType.success:
      return {
        rootColorClasses: 'tw-bg-green-100 tw-border-green-500 tw-text-green-900',
        iconColorClasses: 'tw-text-green-500',
      };

    case AlertType.warning:
      return {
        rootColorClasses: 'tw-bg-yellow-100 tw-border-yellow-500 tw-text-yellow-900',
        iconColorClasses: 'tw-text-yellow-500',
      };
  }

  return {
    rootColorClasses: 'tw-bg-gray-100 tw-border-gray-500 tw-text-gray-900',
    iconColorClasses: 'tw-text-gray-500',
  };
};

const Alert = ({ children, description, title, type }: AlertProps): JSX.Element => {
  const colorClasses = useMemo(() => getColorClasses(type ?? AlertType.default), [type]);

  return (
    <div className={`${colorClasses.rootColorClasses} tw-border-t-4 tw-rounded-b tw-px-4 tw-py-3 tw-shadow-md tw-mb-8`} role="alert">
      <div className="tw-flex">
        <div className="tw-py-1">
          <svg className={`${colorClasses.iconColorClasses} tw-fill-current tw-h-6 w-6 tw-mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          {title && <p className="tw-font-bold">{title}</p>}
          {description && <p>{description}</p>}
          {children && <div>{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default Alert;
