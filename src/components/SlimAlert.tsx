/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';
export enum SlimAlertType {
  danger,
  default,
  info,
  success,
  warning,
}

export interface SlimAlertProps {
  description?: string;
  children?: React.ReactNode;
  id?: string;
  gutterBottom?: boolean;
  type?: SlimAlertType;
}

export type GetColorClassesFunc = (alertType: SlimAlertType) => { rootColorClasses: string; iconColorClasses: string };

export const getColorClasses: GetColorClassesFunc = (alertType) => {
  switch (alertType) {
    case SlimAlertType.danger:
      return {
        rootColorClasses: 'tw-bg-red-50 tw-border-red-600',
        iconColorClasses: 'tw-text-red-600',
      };

    case SlimAlertType.info:
      return {
        rootColorClasses: 'tw-bg-blue-50 tw-border-blue-600',
        iconColorClasses: 'tw-text-blue-600',
      };

    case SlimAlertType.success:
      return {
        rootColorClasses: 'tw-bg-green-50 tw-border-green-600',
        iconColorClasses: 'tw-text-green-600',
      };

    case SlimAlertType.warning:
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

export const SlimAlert = ({ children, description, gutterBottom, id, type }: SlimAlertProps): JSX.Element => {
  const colorClasses = useMemo(() => getColorClasses(type ?? SlimAlertType.default), [type]);

  return (
    <div {...(id ? { id } : {})} className={`${colorClasses.rootColorClasses} tw-border-l-4 tw-rounded tw-px-4 tw-py-2 tw-shadow tw-flex tw-space-x-3 tw-items-center ${gutterBottom ? 'tw-mb-10' : 'tw-mb-0'}`}>
      <div className={`${colorClasses.iconColorClasses} tw-w-5 tw-h-5 tw-inline-block tw-flex-shrink-0`}>
        <svg className="tw-fill-current tw-w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      {(description || children) && (
        <div>
          {description && <p className={`tw-m-0 ${children ? 'tw-mb-6' : ''}`}>{description}</p>}
          {children && <div>{children}</div>}
        </div>
      )}
    </div>
  );
};
