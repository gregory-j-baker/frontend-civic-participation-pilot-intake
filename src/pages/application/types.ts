/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum Constants {
  FormDataStorageKey = 'CPP_APPLICATION_FORM_STATE',
  EmailVerificationStorageKey = 'CPP_EMAIL_VERIFICATION_STORAGE_KEY',
}

export interface GetDescriptionFunc {
  (obj: { descriptionFr: string; descriptionEn: string }): string;
}

export interface Step1State {
  birthYear?: number;
  discoveryChannelId?: string;
  email?: string;
  firstName?: string;
  isCanadianCitizen?: boolean;
  isProvinceMajorCertified?: boolean;
  languageId?: string;
  lastName?: string;
  phoneNumber?: string;
  provinceId?: string;
}

export interface IXStep1State extends Step1State {
  [key: string]: boolean | string | number | null | undefined;
}

export interface Step2State {
  educationLevelId?: string;
  demographicId?: string;
  genderId?: string;
}

export interface IXStep2State extends Step2State {
  [key: string]: string | undefined;
}

export interface Step3State {
  communityInterest?: string;
  skillsInterest?: string;
}

export interface IXStep3State extends Step3State {
  [key: string]: string | undefined;
}

export interface Step4State {
  isInformationConsented?: boolean;
}

export interface IXStep4State extends Step4State {
  [key: string]: boolean | undefined;
}

export interface ApplicationState {
  step1: IXStep1State;
  step2: IXStep2State;
  step3: IXStep3State;
  step4: IXStep4State;
}
