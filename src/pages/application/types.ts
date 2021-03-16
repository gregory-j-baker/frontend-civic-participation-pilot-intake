/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum Constants {
  FormDataStorageKey = 'CPP_APPLICATION_FORM_STATE',
  NoAnswerOptionValue = '--prefer-not-answer',
}

export interface GetDescriptionFunc {
  (obj: { descriptionFr: string; descriptionEn: string }): string;
}

export interface PersonalInformationState {
  [key: string]: boolean | string | number | null | undefined;
  birthYear?: number;
  educationLevelId?: string | null;
  email?: string;
  firstName?: string;
  genderId?: string | null;
  isCanadianCitizen?: boolean;
  isProvinceMajorCertified?: boolean;
  languageId?: string;
  lastName?: string;
  phoneNumber?: string;
  provinceId?: string;
}

export interface IdentityInformationState {
  [key: string]: boolean | string | number | null | undefined;
  indigenousTypeId?: string;
  isDisabled?: boolean | null;
  isLgbtq?: boolean | null;
  isMinority?: boolean | null;
  isNewcomer?: boolean | null;
  isRural?: boolean | null;
}

export interface ExpressionOfInterestState {
  [key: string]: boolean | string | number | null | undefined;
  communityInterest?: string;
  programInterest?: string;
  skillsInterest?: string;
}

export interface ConsentState {
  [key: string]: boolean | string | number | null | undefined;
  discoveryChannelId?: string;
  hasDedicatedDevice?: boolean;
  internetQualityId?: string;
  isInformationConsented?: boolean;
}

export interface ApplicationState {
  personalInformation: PersonalInformationState;
  identityInformation: IdentityInformationState;
  expressionOfInterest: ExpressionOfInterestState;
  consent: ConsentState;
}
