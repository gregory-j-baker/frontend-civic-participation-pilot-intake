/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface FieldErrorMessageProps {
  message: string;
}

export const FieldErrorMessage = ({ message }: FieldErrorMessageProps): JSX.Element => {
  return <div className="tw-font-bold tw-border-l-4 tw-rounded tw-px-4 tw-py-2 tw-shadow tw-my-2 tw-bg-red-50 tw-border-red-600">{message}</div>;
};
