/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ContentPaperProps {
  className?: string;
  children: React.ReactNode;
}

const ContentPaper = ({ className, children }: ContentPaperProps): JSX.Element => {
  return <div className={`tw-rounded tw-overflow-hidden tw-shadow-lg tw-border tw-border-gray-400 tw-mb-8 tw-px-6 tw-py-6 ${className}`}>{children}</div>;
};

export default ContentPaper;
