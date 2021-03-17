/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEvent } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { TailwindColor } from '../../common/types';
import { Button, ButtonOnClickEvent } from '../Button';
import ContentPaper from '../ContentPaper/ContentPaper';

export interface WizardOnNextClickEvent {
  (event: MouseEvent<HTMLButtonElement>): void;
}

export interface WizardOnPreviousClickEvent {
  (event: MouseEvent<HTMLButtonElement>): void;
}

export interface WizardProps {
  activeStep: number;
  children: JSX.Element | JSX.Element[];
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

const WIZARD_CONTAINER_ID = 'wizard-container';

const Wizard = ({ activeStep, children, disabled, header, nextDisabled, nextHidden, nextText, numberOfSteps, onNextClick, onPreviousClick, previousDisabled, previousHidden, previousText, stepText }: WizardProps): JSX.Element => {
  const { t } = useTranslation();

  const handleOnNextClick: ButtonOnClickEvent = (event) => {
    onNextClick?.(event);
  };

  const handleOnPreviousClick: ButtonOnClickEvent = (event) => {
    onPreviousClick?.(event);
  };

  return (
    <div id={WIZARD_CONTAINER_ID}>
      <ContentPaper disablePadding>
        <header className="tw-border-b-2 tw-mx-6 tw-py-4">
          <h3 className="tw-text-base tw-uppercase tw-tracking-wide tw-leading-tight tw-m-0">{`${stepText ? stepText : t('common:wizard.step')}${t('common:wizard.x-of-y', {
            active: activeStep,
            length: numberOfSteps,
          })}`}</h3>
          {header && <h6 className="tw-text-gray-500 tw-leading-tight tw-m-0 tw-mt-2">{header}</h6>}
        </header>
        <div className="tw-my-8 tw-mx-6">{children}</div>
        <div className="tw-flex tw-justify-between tw-flex-col sm:tw-flex-row-reverse tw-border-t-2 tw-py-5 tw-px-6 tw-bg-gray-50">
          <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-text-right">
            {!nextHidden && (
              <Button onClick={handleOnNextClick} disabled={nextDisabled || disabled} className="tw-w-full tw-whitespace-nowrap">
                {nextText ? nextText : t('common:wizard.next')}
              </Button>
            )}
          </div>
          {!previousHidden && (
            <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-mt-4 sm:tw-mt-0">
              <Button onClick={handleOnPreviousClick} color={TailwindColor.white} disabled={previousDisabled || disabled} className="tw-w-full tw-whitespace-nowrap">
                {previousText ? previousText : t('common:wizard.previous')}
              </Button>
            </div>
          )}
        </div>
      </ContentPaper>
    </div>
  );
};

export default Wizard;
