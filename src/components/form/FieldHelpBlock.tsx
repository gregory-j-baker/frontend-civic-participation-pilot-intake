/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface FieldHelpBlockProps {
  children: string | React.ReactNode;
  id?: string;
}

export const FieldHelpBlock = ({ children, id }: FieldHelpBlockProps): JSX.Element => {
  return (
    <span id={id} className="tw-block tw-mb-2 tw-text-gray-600">
      {children}
    </span>
  );
};
