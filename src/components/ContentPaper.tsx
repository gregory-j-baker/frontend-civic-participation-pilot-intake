/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ContentPaperProps {
  className?: string;
  children: React.ReactNode;
  disablePadding?: boolean;
  gutterBottom?: boolean;
  tabIndex?: number;
}

export const ContentPaper = ({ className, children, disablePadding, gutterBottom, tabIndex }: ContentPaperProps): JSX.Element => {
  return (
    <section tabIndex={tabIndex} className={`tw-rounded tw-overflow-hidden tw-shadow ${!disablePadding ? 'tw-p-4 sm:tw-p-6' : ''} tw-border ${gutterBottom ?? false ? 'tw-mb-8' : ''} ${className ?? ''}`}>
      {children}
    </section>
  );
};
