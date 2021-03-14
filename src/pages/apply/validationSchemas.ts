/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { kebabCase } from 'lodash';
import * as yup from 'yup';
import { BooleanLocale, MixedLocale, StringLocale } from 'yup/lib/locale';

const mixedLocale: MixedLocale = {
  required: ({ path }) => `${kebabCase(path)}.required`,
  defined: ({ path }) => `${kebabCase(path)}.required`,
};

const stringLocale: StringLocale = {
  email: ({ path }) => `${kebabCase(path)}.email-invalid`,
};

const booleanLocale: BooleanLocale = {
  isValue: ({ path, value }) => `${kebabCase(path)}.must-be-${value.toLowerCase()}`,
};

yup.setLocale({
  mixed: mixedLocale,
  string: stringLocale,
  boolean: booleanLocale,
});

export const personalInformationSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  birthYear: yup.number().required().positive().integer(),
  isProvinceMajorCertified: yup.boolean().required().isTrue(),
  languageId: yup.string().required(),
  isCanadianCitizen: yup.boolean().required(),
  provinceId: yup.string().required(),
  genderId: yup.string().nullable().defined(),
  educationLevelId: yup.string().nullable().defined(),
});

export const identityInformationSchema = yup.object().shape({
  isDisabled: yup.string().nullable().defined(),
  isMinority: yup.string().nullable().defined(),
  indigenousTypeId: yup.string().nullable().defined(),
  isLgbtq: yup.string().nullable().defined(),
  isRural: yup.string().nullable().defined(),
  isNewcomer: yup.string().nullable().defined(),
});

export const expressionOfInterestSchema = yup.object().shape({
  skillsInterest: yup.string().required(),
  communityInterest: yup.string().required(),
  programInterest: yup.string(),
});

export const consentSchema = yup.object().shape({
  internetQualityId: yup.string().required(),
  hasDedicatedDevice: yup.boolean().required(),
  discoveryChannelId: yup.string().required(),
  isInformationConsented: yup.boolean().required().isTrue(),
});

export const formSchema = yup.object().shape({
  personalInformation: personalInformationSchema.required(),
  identityInformation: identityInformationSchema.required(),
  expressionOfInterest: expressionOfInterestSchema.required(),
  consent: consentSchema.required(),
});
