/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Yup from 'yup';
import './yup-custom';

export interface WordLength {
  min: number;
  max: number;
}

export const SkillsInterestWordLength: WordLength = {
  min: 20,
  max: 250,
};

export const CommunityInterestWordLength: WordLength = {
  min: 20,
  max: 250,
};

/**
 * IMPORTANT: Props order is based on screen order
 */

export const step1Schema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().phone(),
  birthYear: Yup.number().required().positive().integer(),
  isProvinceMajorCertified: Yup.boolean().required().isTrue(),
  languageId: Yup.string().required(),
  isCanadianCitizen: Yup.boolean().required(),
  provinceId: Yup.string().required(),
  discoveryChannelId: Yup.string().required(),
});

export const step2Schema = Yup.object().shape({
  genderId: Yup.string().nullable().defined(),
  educationLevelId: Yup.string().nullable().defined(),
  demographicId: Yup.string().nullable().defined(),
});

export const step3Schema = Yup.object().shape({
  communityInterest: Yup.string().minWord(CommunityInterestWordLength.min).maxWord(CommunityInterestWordLength.max).max(2048).required(),
  skillsInterest: Yup.string().minWord(SkillsInterestWordLength.min).maxWord(SkillsInterestWordLength.max).max(2048).required(),
});

export const step4Schema = Yup.object().shape({
  isInformationConsented: Yup.boolean().required().isTrue(),
});

export const applicationSchema = Yup.object().shape({
  step1: step1Schema.required(),
  step2: step2Schema.required(),
  step3: step3Schema.required(),
  step4: step4Schema.required(),
});
