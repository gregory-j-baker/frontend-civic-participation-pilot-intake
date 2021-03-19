/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum Constants {
  FormDataStorageKey = 'CPP_APPLICATION_FORM_STATE',
}

export interface GetDescriptionFunc {
  (obj: { descriptionFr: string; descriptionEn: string }): string;
}

export interface ConsentState {
  isInformationConsented?: boolean;
}

export interface IXConsentState extends ConsentState {
  [key: string]: boolean | undefined;
}

export interface ExpressionOfInterestState {
  communityInterest?: string;
  programInterest?: string;
  skillsInterest?: string;
}

export interface IXExpressionOfInterestState extends ExpressionOfInterestState {
  [key: string]: string | undefined;
}

export interface IdentityInformationState {
  disabilityId?: string | null;
  educationLevelId?: string | null;
  genderId?: string | null;
  indigenousTypeId?: string | null;
  minorityId?: string | null;
  newcomerId?: string | null;
  ruralId?: string | null;
  sexualOrientationId?: string | null;
}

export interface IXIdentityInformationState extends IdentityInformationState {
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

export interface IXPersonalInformationState extends PersonalInformationState {
  [key: string]: boolean | string | number | null | undefined;
}

export interface ApplicationState {
  consent: IXConsentState;
  identityInformation: IdentityInformationState;
  expressionOfInterest: ExpressionOfInterestState;
  personalInformation: PersonalInformationState;
}
