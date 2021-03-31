/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface TableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const TableWrapper = ({ children, className }: TableWrapperProps): JSX.Element => {
  return (
    <div className={`tw-flex tw-flex-col ${className}`}>
      <div className="tw--my-2 tw-overflow-x-auto sm:tw--mx-6 lg:tw--mx-8">
        <div className="tw-py-2 tw-align-middle tw-inline-block tw-min-w-full sm:tw-px-6 lg:tw-px-8">
          <div className="tw-shadow tw-overflow-hidden tw-border-b tw-border-gray-200 sm:tw-rounded-lg">{children}</div>
        </div>
      </div>
    </div>
  );
};
