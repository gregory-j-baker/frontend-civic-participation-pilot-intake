/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Yup from 'yup';
import './yup-custom';

/**
 * IMPORTANT: Props order is based on screen order
 */

export const personalInformationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().phone(),
  birthYear: Yup.number().required().positive().integer(),
  isProvinceMajorCertified: Yup.boolean().required().isTrue(),
  languageId: Yup.string().required(),
  isCanadianCitizen: Yup.boolean().required(),
  provinceId: Yup.string().required(),
  internetQualityId: Yup.string().required(),
  hasDedicatedDevice: Yup.boolean().required(),
  discoveryChannelId: Yup.string().required(),
});

export const identityInformationSchema = Yup.object().shape({
  genderId: Yup.string().nullable().defined(),
  educationLevelId: Yup.string().nullable().defined(),
  isDisabled: Yup.boolean().nullable().defined(),
  isMinority: Yup.boolean().nullable().defined(),
  indigenousTypeId: Yup.string().nullable().defined(),
  isLgbtq: Yup.boolean().nullable().defined(),
  isRural: Yup.boolean().nullable().defined(),
  isNewcomer: Yup.boolean().nullable().defined(),
});

export const expressionOfInterestSchema = Yup.object().shape({
  skillsInterest: Yup.string().required(),
  communityInterest: Yup.string().required(),
  programInterest: Yup.string(),
});

export const consentSchema = Yup.object().shape({
  isInformationConsented: Yup.boolean().required().isTrue(),
});

export const applicationSchema = Yup.object().shape({
  personalInformation: personalInformationSchema.required(),
  identityInformation: identityInformationSchema.required(),
  expressionOfInterest: expressionOfInterestSchema.required(),
  consent: consentSchema.required(),
});
