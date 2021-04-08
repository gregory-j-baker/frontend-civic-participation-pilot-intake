/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Button, ButtonOnClickEvent } from './Button';
import { ContentPaper } from './ContentPaper';
import { TailwindColor } from '../common/types';

export type WizardOnNextClickEvent = (event: MouseEvent<HTMLButtonElement>) => void;
export type WizardOnPreviousClickEvent = (event: MouseEvent<HTMLButtonElement>) => void;

export interface WizardProps {
  activeStep: number;
  children: React.ReactNode;
  disabled?: boolean;
  header?: string;
  nextDisabled?: boolean;
  nextHidden?: boolean;
  nextText?: string;
  numberOfSteps: number;
  onNextClick?: WizardOnNextClickEvent;
  onPreviousClick?: WizardOnPreviousClickEvent;
  previousDisabled?: boolean;
  previousHidden?: boolean;
  previousText?: string;
  stepText?: string;
}

export const WIZARD_CONTAINER_ID = 'wizard-container';

export const Wizard = ({ activeStep, children, disabled, header, nextDisabled, nextHidden, nextText, numberOfSteps, onNextClick, onPreviousClick, previousDisabled, previousHidden, previousText, stepText }: WizardProps): JSX.Element => {
  const { t } = useTranslation();

  const handleOnNextClick: ButtonOnClickEvent = (event) => {
    onNextClick?.(event);
  };

  const handleOnPreviousClick: ButtonOnClickEvent = (event) => {
    onPreviousClick?.(event);
  };

  return (
    <div id={WIZARD_CONTAINER_ID}>
      <ContentPaper disablePadding className="tw-bg-white">
        <header className="tw-border-b-2 tw-mx-4 sm:tw-mx-6 tw-py-4 sm:tw-py-6">
          <h3 className="tw-uppercase tw-tracking-wide tw-leading-tight tw-m-0 tw-text-lg">{`${stepText ? stepText : t('common:wizard.step')}${t('common:wizard.x-of-y', {
            active: activeStep,
            length: numberOfSteps,
          })}`}</h3>
          {header && <p className="tw-text-gray-500 tw-leading-tight tw-m-0 tw-mt-4 tw-text-lg">{header}</p>}
        </header>
        <div className="tw-px-6 tw-py-6 sm:tw-py-8">{children}</div>
        <div className="tw-flex tw-flex-col sm:tw-flex-row tw-border-t-2 tw-p-4 sm:tw-p-6">
          {!previousHidden && (
            <Button onClick={handleOnPreviousClick} color={TailwindColor.white} disabled={previousDisabled || disabled} className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-mb-4 sm:tw-mb-0 tw-whitespace-nowrap">
              {previousText ? previousText : t('common:wizard.previous')}
            </Button>
          )}
          {!nextHidden && (
            <Button onClick={handleOnNextClick} disabled={nextDisabled || disabled} className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-whitespace-nowrap tw-ml-auto">
              {nextText ? nextText : t('common:wizard.next')}
            </Button>
          )}
        </div>
      </ContentPaper>
    </div>
  );
};
