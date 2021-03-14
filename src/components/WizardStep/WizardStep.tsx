/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface WizardStepProps {
  children?: React.ReactNode;
  header?: string;
  id: string;
}

const WizardStep = ({ children }: WizardStepProps): JSX.Element => <>{children}</>;

export default WizardStep;
