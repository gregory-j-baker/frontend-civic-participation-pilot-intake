/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface FormDefinitionListItemProps {
  definition: string;
  even: boolean;
  term: string;
}

const FormDefinitionListItem = ({ definition, even, term }: FormDefinitionListItemProps): JSX.Element => (
  <div className={`tw-p-4 md:tw-px-6 md:tw-grid md:tw-grid-cols-2 md:tw-gap-4 ${even ? 'tw-bg-gray-50' : ''}`}>
    <dt className="tw-m-0 tw-mb-2 md:tw-mb-0 tw-font-medium tw-text-gray-500">{term}</dt>
    <dd className="tw-m-0">{definition}</dd>
  </div>
);

export default FormDefinitionListItem;
