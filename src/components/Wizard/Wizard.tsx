/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEvent, ReactNode, useMemo, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { TailwindColor } from '../../common/types';
import { Button, ButtonOnClickEvent } from '../Button';
import ContentPaper from '../ContentPaper/ContentPaper';
import { WizardStepProps } from '../WizardStep';
import { getKeyboardFocusableElements } from '../../utils/misc-utils';

export interface WizardOnNextClickEvent {
  (event: MouseEvent<HTMLButtonElement>): boolean;
}

export interface WizardOnPreviousClickEvent {
  (event: MouseEvent<HTMLButtonElement>): boolean;
}
export interface WizardOnSubmitClickEvent {
  (event: MouseEvent<HTMLButtonElement>): void;
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

const WIZARD_CONTAINER_ID = 'wizard-container';

const Wizard = ({ initialActiveStep, children, disabled, nextText, onNextClick, onPreviousClick, onSubmitClick, previousText, stepText, submitText }: WizardProps): JSX.Element => {
  const { t } = useTranslation();

  const steps = useMemo(() => children as React.ReactElement<WizardStepProps>[], [children]);

  const [activeStep, setActiveStep] = useState<number>(initialActiveStep ? (steps[initialActiveStep] ? initialActiveStep : 1) : 1);

  const { header, step } = useMemo<{ header?: string; step?: ReactNode }>(() => (steps[activeStep - 1] ? { header: steps[activeStep - 1].props.header, step: steps[activeStep - 1].props.children } : {}), [activeStep, steps]);

  const goToWizardTop = (): void => {
    const containerElement = document.getElementById(WIZARD_CONTAINER_ID);
    if (containerElement) {
      containerElement.scrollIntoView({ behavior: 'smooth' });

      // give time to render before focusing on next first focusable element
      setTimeout(() => {
        (getKeyboardFocusableElements(containerElement).find(Boolean) as HTMLElement)?.focus();
      }, 200);
    }
  };

  const handleOnNextClick: ButtonOnClickEvent = (event) => {
    if (activeStep < steps.length && (!onNextClick || onNextClick(event))) {
      setActiveStep((prev) => ++prev);
      goToWizardTop();
    }
  };

  const handleOnPreviousClick: ButtonOnClickEvent = (event) => {
    if (activeStep > 1 && (!onPreviousClick || onPreviousClick(event))) {
      setActiveStep((prev) => --prev);
      goToWizardTop();
    }
  };

  const handleOnSubmitClick: ButtonOnClickEvent = (event) => {
    if (activeStep === steps.length && onSubmitClick) {
      onSubmitClick(event);
    }
  };

  return (
    <ContentPaper disablePadding>
      <div id={WIZARD_CONTAINER_ID}>
        <div className="tw-border-b-2 tw-mx-6 tw-py-4">
          <h5 className="tw-uppercase tw-tracking-wide tw-text-sm tw-font-bold tw-text-gray-500 tw-leading-tight tw-m-0 tw-mb-2">{`${stepText ? stepText : t('common:wizard.step')}${t('common:wizard.x-of-y', {
            active: activeStep,
            length: steps.length,
          })}`}</h5>
          <h6 className="tw-text-xl tw-font-bold tw-leading-tight tw-m-0">{header}</h6>
        </div>
        <div className="tw-my-8 tw-mx-6">{step}</div>
        <div className="tw-flex tw-justify-between tw-flex-col sm:tw-flex-row-reverse tw-border-t-2 tw-py-5 tw-px-6 tw-bg-gray-50">
          <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-text-right">
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
          {activeStep > 1 && (
            <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-mt-4 sm:tw-mt-0">
              <Button onClick={handleOnPreviousClick} color={TailwindColor.white} disabled={disabled} className="tw-w-full tw-whitespace-nowrap">
                {previousText ? previousText : t('common:wizard.previous')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </ContentPaper>
  );
};

export default Wizard;
