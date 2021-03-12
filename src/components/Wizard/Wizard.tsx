/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MouseEvent, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { TailwindColor } from '../../common/types';
import { Button, ButtonOnClickEvent } from '../Button';
import ContentPaper from '../ContentPaper/ContentPaper';
import { WizardStepProps } from '../WizardStep';

export interface WizardOnNextClickEvent {
  (event: MouseEvent<HTMLButtonElement>, activeStepId: string, nextStepId: string): void;
}

export interface WizardOnPreviousClickEvent {
  (event: MouseEvent<HTMLButtonElement>, activeStepId: string, nextStepId: string): void;
}
export interface WizardOnSubmitClickEvent {
  (event: MouseEvent<HTMLButtonElement>, activeStepId: string): void;
}

export interface WizardProps {
  activeStepId: string;
  children: React.ReactElement<WizardStepProps>[];
  disabled?: boolean;
  nextDisabled?: boolean;
  nextText?: string;
  onNextClick?: WizardOnNextClickEvent;
  onPreviousClick?: WizardOnPreviousClickEvent;
  onSubmitClick?: WizardOnSubmitClickEvent;
  previousDisabled?: boolean;
  previousText?: string;
  stepText?: string;
  submitDisabled?: boolean;
  submitText?: string;
}

const WIZARD_CONTAINER_ID = 'wizard-container';

const Wizard = ({ activeStepId, children, disabled, nextDisabled, nextText, onNextClick, onPreviousClick, onSubmitClick, previousDisabled, previousText, stepText, submitDisabled, submitText }: WizardProps): JSX.Element => {
  const { t } = useTranslation();

  const steps = useMemo(() => children as React.ReactElement<WizardStepProps>[], [children]);

  const activeStepIndex = useMemo<number>(() => {
    const index = steps.findIndex((el) => el.props.id.toLowerCase() === activeStepId.toLowerCase());
    return index === -1 ? index : index + 1;
  }, [activeStepId, steps]);

  const activeStep = useMemo<WizardStepProps>(() => (steps[activeStepIndex - 1] ? steps[activeStepIndex - 1].props : { id: 'NOT_FOUND', header: 'NOT_FOUND' }), [activeStepIndex, steps]);

  const handleOnPreviousClick: ButtonOnClickEvent = (event) => {
    if (activeStepIndex > 1) {
      onPreviousClick?.(event, activeStep.id, steps[activeStepIndex - 2].props.id);
    }
  };

  const handleOnNextClick: ButtonOnClickEvent = (event) => {
    if (activeStepIndex < steps.length) {
      onNextClick?.(event, activeStep.id, steps[activeStepIndex].props.id);
    }
  };

  const handleOnSubmitClick: ButtonOnClickEvent = (event) => {
    if (activeStepIndex === steps.length) {
      onSubmitClick?.(event, activeStep.id);
    }
  };

  return (
    <ContentPaper disablePadding>
      <div id={WIZARD_CONTAINER_ID}>
        <div className="tw-border-b-2 tw-mx-6 tw-py-4">
          <h5 className="tw-uppercase tw-tracking-wide tw-text-sm tw-font-bold tw-text-gray-500 tw-leading-tight tw-m-0 tw-mb-2">{`${stepText ? stepText : t('common:wizard.step')}${t('common:wizard.x-of-y', {
            active: activeStepIndex,
            length: steps.length,
          })}`}</h5>
          <h6 className="tw-text-xl tw-font-bold tw-leading-tight tw-m-0">{activeStep.header}</h6>
        </div>
        <div className="tw-my-8 tw-mx-6">{activeStep.children}</div>
        <div className="tw-flex tw-justify-between tw-flex-col sm:tw-flex-row-reverse tw-border-t-2 tw-py-5 tw-px-6 tw-bg-gray-50">
          <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-text-right">
            {activeStepIndex < steps.length && (
              <Button onClick={handleOnNextClick} disabled={nextDisabled || disabled} className="tw-w-full tw-whitespace-nowrap">
                {nextText ? nextText : t('common:wizard.next')}
              </Button>
            )}
            {activeStepIndex === steps.length && (
              <Button onClick={handleOnSubmitClick} disabled={submitDisabled || disabled} className="tw-w-full  tw-whitespace-nowrap">
                {submitText ? submitText : t('common:wizard.submit')}
              </Button>
            )}
          </div>
          {activeStepIndex > 1 && (
            <div className="tw-w-full sm:tw-w-4/12 md:tw-w-3/12 tw-mt-4 sm:tw-mt-0">
              <Button onClick={handleOnPreviousClick} color={TailwindColor.white} disabled={previousDisabled || disabled} className="tw-w-full tw-whitespace-nowrap">
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
