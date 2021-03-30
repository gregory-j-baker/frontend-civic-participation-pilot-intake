/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { FormDefinitionListItem } from '../FormDefinitionListItem';
import { useLanguage } from '../../hooks/api/code-lookups/useLanguage';
import { GetDescriptionFunc } from '../../pages/application/types';
import { useProvince } from '../../hooks/api/code-lookups/useProvince';
import { useDemographic } from '../../hooks/api/code-lookups/useDemographic';
import { useDiscoveryChannel } from '../../hooks/api/code-lookups/useDiscoveryChannel';
import { useEducationLevel } from '../../hooks/api/code-lookups/useEducationLevel';
import { useGender } from '../../hooks/api/code-lookups/useGender';

export interface ApplicationReviewProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthYear?: number;
  languageId?: string;
  isCanadianCitizen?: boolean;
  provinceId?: string;
  discoveryChannelId?: string;
  genderId?: string;
  educationLevelId?: string;
  demographicId?: string;
  skillsInterest?: string;
  communityInterest?: string;
}

export interface FormReviewItem {
  children?: React.ReactNode;
  key: string;
  text: string;
  value: string;
}

export const ApplicationReview = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  birthYear,
  languageId,
  isCanadianCitizen,
  provinceId,
  discoveryChannelId,
  genderId,
  educationLevelId,
  demographicId,
  skillsInterest,
  communityInterest,
}: ApplicationReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: demographic, isLoading: demographicIsLoading } = useDemographic(demographicId as string);
  const { data: discoveryChannel, isLoading: discoveryChannelIsLoading } = useDiscoveryChannel(discoveryChannelId as string);
  const { data: educationLevel, isLoading: educationLevelIsLoading } = useEducationLevel(educationLevelId as string);
  const { data: gender, isLoading: genderIsLoading } = useGender(genderId as string);
  const { data: language, isLoading: languageIsLoading } = useLanguage(languageId as string);
  const { data: province, isLoading: provinceIsLoading } = useProvince(provinceId as string);

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    // firstName
    if (firstName) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.firstName),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.firstName)}.label`),
        value: firstName,
      });
    }

    // lastName
    if (lastName) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.lastName),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.lastName)}.label`),
        value: lastName,
      });
    }

    // email
    if (email) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.email),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.email)}.label`),
        value: email,
      });
    }

    // phone
    if (phoneNumber) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.phoneNumber),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.phoneNumber)}.label`),
        value: phoneNumber,
      });
    }

    // birthYear
    if (birthYear) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.birthYear),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.birthYear)}.label`),
        value: birthYear.toString(),
      });
    }

    // languageId
    if (!languageIsLoading && language) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.languageId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.languageId)}.label`),
        value: getDescription(language),
      });
    }

    // isCanadianCitizen
    if (isCanadianCitizen !== undefined) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.isCanadianCitizen),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.isCanadianCitizen)}.label`),
        value: isCanadianCitizen ? t('common:yes') : t('common:no'),
      });
    }

    // provindId
    if (!provinceIsLoading && province) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.provinceId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.provinceId)}.label`),
        value: getDescription(province),
      });
    }

    // discoveryChannelId
    if (!discoveryChannelIsLoading && discoveryChannel) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.discoveryChannelId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.discoveryChannelId)}.label`),
        value: getDescription(discoveryChannel),
      });
    }

    // genderId
    if (!genderIsLoading && gender) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.genderId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.genderId)}.label`),
        value: getDescription(gender),
      });
    }

    // educationLevelId
    if (!educationLevelIsLoading && educationLevel) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.educationLevelId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.educationLevelId)}.label`),
        value: getDescription(educationLevel),
      });
    }

    // demographicId
    if (!demographicIsLoading && demographic) {
      items.push({
        children: (
          <ul className="tw-list-disc tw-list-inside tw-my-4">
            {[
              t('application:field.demographicId.children-items.item-1'),
              t('application:field.demographicId.children-items.item-2'),
              t('application:field.demographicId.children-items.item-3'),
              t('application:field.demographicId.children-items.item-4'),
              t('application:field.demographicId.children-items.item-5'),
              t('application:field.demographicId.children-items.item-6'),
              t('application:field.demographicId.children-items.item-7'),
            ].map((val) => (
              <li key={val} className="tw-mb-2">
                {val}
              </li>
            ))}
          </ul>
        ),
        key: nameof<ApplicationReviewProps>((o) => o.demographicId),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.demographicId)}.label`),
        value: getDescription(demographic),
      });
    }

    // skillsInterest
    if (skillsInterest) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.skillsInterest),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.skillsInterest)}.label`),
        value: skillsInterest,
      });
    }

    // communityInterest
    if (communityInterest) {
      items.push({
        key: nameof<ApplicationReviewProps>((o) => o.communityInterest),
        text: t(`application:field.${nameof<ApplicationReviewProps>((o) => o.communityInterest)}.label`),
        value: communityInterest,
      });
    }

    return items;
  }, [
    t,
    birthYear,
    communityInterest,
    demographic,
    demographicIsLoading,
    discoveryChannel,
    discoveryChannelIsLoading,
    educationLevel,
    educationLevelIsLoading,
    email,
    firstName,
    gender,
    genderIsLoading,
    getDescription,
    isCanadianCitizen,
    language,
    languageIsLoading,
    lastName,
    phoneNumber,
    province,
    provinceIsLoading,
    skillsInterest,
  ]);

  return (
    <dl>
      {formReviewItems.map(({ children, key, text, value }, index) => (
        <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value}>
          {children}
        </FormDefinitionListItem>
      ))}
    </dl>
  );
};
