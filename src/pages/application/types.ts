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

export interface ConsentState {
  isInformationConsented?: boolean;
}

export interface ConsentStateIndexType extends ConsentState {
  [key: string]: boolean | undefined;
}

export interface ExpressionOfInterestState {
  communityInterest?: string;
  programInterest?: string;
  skillsInterest?: string;
}

export interface ExpressionOfInterestStateIndexType extends ExpressionOfInterestState {
  [key: string]: string | undefined;
}

export interface IdentityInformationState {
  educationLevelId?: string | null;
  genderId?: string | null;
  indigenousTypeId?: string | null;
  isDisabled?: boolean | null;
  isLgbtq?: boolean | null;
  isMinority?: boolean | null;
  isNewcomer?: boolean | null;
  isRural?: boolean | null;
}

export interface IdentityInformationStateIndexType extends IdentityInformationState {
  [key: string]: boolean | string | null | undefined;
}

export interface PersonalInformationState {
  birthYear?: number;
  discoveryChannelId?: string;
  email?: string;
  firstName?: string;
  hasDedicatedDevice?: boolean;
  internetQualityId?: string;
  isCanadianCitizen?: boolean;
  isProvinceMajorCertified?: boolean;
  languageId?: string;
  lastName?: string;
  phoneNumber?: string;
  provinceId?: string;
}

export interface PersonalInformationStateIndexType extends PersonalInformationState {
  [key: string]: boolean | string | number | null | undefined;
}

export interface ApplicationState {
  consent: ConsentStateIndexType;
  identityInformation: IdentityInformationStateIndexType;
  expressionOfInterest: ExpressionOfInterestStateIndexType;
  personalInformation: PersonalInformationStateIndexType;
}
