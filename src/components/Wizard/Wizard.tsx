/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useTranslation from 'next-translate/useTranslation';
import { MouseEvent, ReactNode, useMemo, useState } from 'react';
import { TailwindColor } from '../../common/types';
import { Button, ButtonOnClickEvent } from '../Button';
import ContentPaper from '../ContentPaper/ContentPaper';
import { WizardStepProps } from '../WizardStep';

export interface WizardOnNextClickEvent {
  (event: MouseEvent<HTMLButtonElement>): boolean;
}

export interface WizardOnPreviousClickEvent {
  (event: MouseEvent<HTMLButtonElement>): boolean;
}
export interface WizardOnSubmitClickEvent {
  (event: MouseEvent<HTMLButtonElement>): boolean;
}

export interface WizardProps {
  initialActiveStep?: number;
  children: React.ReactElement<WizardStepProps>[];
  disabled?: boolean;
  nextText?: string;
  onNextClick?: WizardOnNextClickEvent;
  onPreviousClick?: WizardOnPreviousClickEvent;
  onSubmitClick?: WizardOnSubmitClickEvent;
  previousText?: string;
  stepText?: string;
  submitText?: string;
}

const Wizard = ({ initialActiveStep, children, disabled, nextText, onNextClick, onPreviousClick, onSubmitClick, previousText, stepText, submitText }: WizardProps): JSX.Element => {
  const { t } = useTranslation();

  const steps = useMemo(() => children as React.ReactElement<WizardStepProps>[], [children]);

  const [activeStep, setActiveStep] = useState<number>(initialActiveStep ? (steps[initialActiveStep] ? initialActiveStep : 1) : 1);

  const { header, step } = useMemo<{ header?: string; step?: ReactNode }>(() => (steps[activeStep - 1] ? { header: steps[activeStep - 1].props.header, step: steps[activeStep - 1].props.children } : {}), [activeStep, steps]);

  const handleOnNextClick: ButtonOnClickEvent = (event) => {
    if (activeStep < steps.length && (!onNextClick || onNextClick(event))) {
      setActiveStep((prev) => ++prev);
    }
  };

  const handleOnPreviousClick: ButtonOnClickEvent = (event) => {
    if (activeStep > 1 && (!onPreviousClick || onPreviousClick(event))) {
      setActiveStep((prev) => --prev);
    }
  };

  const handleOnSubmitClick: ButtonOnClickEvent = (event) => {
    if (activeStep === steps.length && onSubmitClick) {
      onSubmitClick(event);
    }
  };

  return (
    <ContentPaper disablePadding>
      <div className="tw-border-b-2 tw-mx-6 tw-py-4">
        <div className="tw-uppercase tw-tracking-wide tw-text-sm tw-font-bold tw-text-gray-500 tw-mb-1 tw-leading-tight">{`${stepText ? stepText : t('common:wizard.step')}${t('common:wizard.x-of-y', { active: activeStep, length: steps.length })}`}</div>
        <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between">
          <div className="tw-text-xl tw-font-bold tw-leading-tight">{header}</div>
        </div>
      </div>
      <div className="tw-my-8 tw-mx-6">{step}</div>
      <div className="tw-flex tw-justify-between tw-flex-col sm:tw-flex-row-reverse tw-border-t-2 tw-py-5 tw-px-6 tw-bg-gray-50">
        <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-text-right tw-mb-4 sm:tw-mb-0">
          {activeStep < steps.length && (
            <Button onClick={handleOnNextClick} disabled={disabled} className="tw-w-full tw-whitespace-nowrap">
              {nextText ? nextText : t('common:wizard.next')}
            </Button>
          )}
          {activeStep === steps.length && (
            <Button onClick={handleOnSubmitClick} disabled={disabled} className="tw-w-full  tw-whitespace-nowrap">
              {submitText ? submitText : t('common:wizard.submit')}
            </Button>
          )}
        </div>
        <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 ">
          {activeStep > 1 && (
            <Button onClick={handleOnPreviousClick} color={TailwindColor.white} disabled={disabled} className="tw-w-full tw-whitespace-nowrap">
              {previousText ? previousText : t('common:wizard.previous')}
            </Button>
          )}
        </div>
      </div>
    </ContentPaper>
  );
};

export default Wizard;
