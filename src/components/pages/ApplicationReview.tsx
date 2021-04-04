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
import { ApplicationBase } from '../../hooks/api/applications/types';
import { nlToLines } from '../../utils/misc-utils';

export interface ApplicationReviewProps {
  application: ApplicationBase;
}

export interface FormReviewItem {
  children?: React.ReactNode;
  key: string;
  text: string;
  value: string | React.ReactNode;
}

export const ApplicationReview = ({ application }: ApplicationReviewProps): JSX.Element => (
  <>
    <Step1Review application={application} />
    <Step2Review application={application} />
    <Step3Review application={application} />
  </>
);

const Step1Review = ({ application }: ApplicationReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: discoveryChannel, isLoading: discoveryChannelIsLoading } = useDiscoveryChannel(application.discoveryChannelId);
  const { data: language, isLoading: languageIsLoading } = useLanguage(application.languageId);
  const { data: province, isLoading: provinceIsLoading } = useProvince(application.provinceId);

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    // firstName
    items.push({
      key: nameof<ApplicationBase>((o) => o.firstName),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.firstName)}.label`),
      value: application.firstName,
    });

    // lastName
    items.push({
      key: nameof<ApplicationBase>((o) => o.lastName),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.lastName)}.label`),
      value: application.lastName,
    });

    // email
    items.push({
      key: nameof<ApplicationBase>((o) => o.email),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.email)}.label`),
      value: application.email,
    });

    // phone
    if (application.phoneNumber) {
      items.push({
        key: nameof<ApplicationBase>((o) => o.phoneNumber),
        text: t(`application:field.${nameof<ApplicationBase>((o) => o.phoneNumber)}.label`),
        value: application.phoneNumber,
      });
    }

    // birthYear
    items.push({
      key: nameof<ApplicationBase>((o) => o.birthYear),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.birthYear)}.label`),
      value: application.birthYear.toString(),
    });

    // languageId
    items.push({
      key: nameof<ApplicationBase>((o) => o.languageId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.languageId)}.label`),
      value: languageIsLoading ? '' : language ? getDescription(language) : <DataNotFound />,
    });

    // isCanadianCitizen
    items.push({
      key: nameof<ApplicationBase>((o) => o.isCanadianCitizen),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.isCanadianCitizen)}.label`),
      value: application.isCanadianCitizen ? t('common:yes') : t('common:no'),
    });

    // provindId
    items.push({
      key: nameof<ApplicationBase>((o) => o.provinceId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.provinceId)}.label`),
      value: provinceIsLoading ? '' : province ? getDescription(province) : <DataNotFound />,
    });

    // discoveryChannelId
    items.push({
      key: nameof<ApplicationBase>((o) => o.discoveryChannelId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.discoveryChannelId)}.label`),
      value: discoveryChannelIsLoading ? '' : discoveryChannel ? getDescription(discoveryChannel) : <DataNotFound />,
    });

    return items;
  }, [
    t,
    getDescription,
    application.birthYear,
    application.email,
    application.firstName,
    application.isCanadianCitizen,
    application.lastName,
    application.phoneNumber,
    discoveryChannel,
    discoveryChannelIsLoading,
    language,
    languageIsLoading,
    province,
    provinceIsLoading,
  ]);

  return (
    <>
      <header className="tw-font-bold tw-text-2xl tw-mb-8">{t('application:step-1.title')}</header>
      <dl className="tw-mb-10">
        {formReviewItems.map(({ children, key, text, value }, index) => (
          <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value}>
            {children}
          </FormDefinitionListItem>
        ))}
      </dl>
    </>
  );
};

const Step2Review = ({ application }: ApplicationReviewProps): JSX.Element => {
  const { t, lang } = useTranslation();

  const { data: demographic, isLoading: demographicIsLoading } = useDemographic(application.demographicId);
  const { data: educationLevel, isLoading: educationLevelIsLoading } = useEducationLevel(application.educationLevelId);
  const { data: gender, isLoading: genderIsLoading } = useGender(application.genderId);

  const getDescription: GetDescriptionFunc = useCallback(({ descriptionFr, descriptionEn }) => (lang === 'fr' ? descriptionFr : descriptionEn), [lang]);

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    // genderId
    items.push({
      key: nameof<ApplicationBase>((o) => o.genderId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.genderId)}.label`),
      value: genderIsLoading ? '' : gender ? getDescription(gender) : <DataNotFound />,
    });

    // educationLevelId
    items.push({
      key: nameof<ApplicationBase>((o) => o.educationLevelId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.educationLevelId)}.label`),
      value: educationLevelIsLoading ? '' : educationLevel ? getDescription(educationLevel) : <DataNotFound />,
    });

    // demographicId
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
      key: nameof<ApplicationBase>((o) => o.demographicId),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.demographicId)}.label`),
      value: demographicIsLoading ? '' : demographic ? getDescription(demographic) : <DataNotFound />,
    });

    return items;
  }, [t, getDescription, demographic, demographicIsLoading, educationLevel, educationLevelIsLoading, gender, genderIsLoading]);

  return (
    <>
      <header className="tw-font-bold tw-text-2xl tw-mb-8">{t('application:step-2.title')}</header>
      <dl className="tw-mb-10">
        {formReviewItems.map(({ children, key, text, value }, index) => (
          <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value}>
            {children}
          </FormDefinitionListItem>
        ))}
      </dl>
    </>
  );
};

const Step3Review = ({ application }: ApplicationReviewProps): JSX.Element => {
  const { t } = useTranslation();

  const formReviewItems: FormReviewItem[] = useMemo(() => {
    const items: FormReviewItem[] = [];

    // communityInterest
    const communityInterestLines = nlToLines(application.communityInterest);
    items.push({
      key: nameof<ApplicationBase>((o) => o.communityInterest),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.communityInterest)}.label`),
      value: communityInterestLines.map((line, index) => (
        <p key={`${index} - ${line}`} className={`tw-m-0 ${index + 1 < communityInterestLines.length ? 'tw-mb-4' : ''}`}>
          {line}
        </p>
      )),
    });

    // skillsInterest
    const skillsInterestLines = nlToLines(application.skillsInterest);
    items.push({
      key: nameof<ApplicationBase>((o) => o.skillsInterest),
      text: t(`application:field.${nameof<ApplicationBase>((o) => o.skillsInterest)}.label`),
      value: skillsInterestLines.map((line, index) => (
        <p key={`${index} - ${line}`} className={`tw-m-0 ${index + 1 < skillsInterestLines.length ? 'tw-mb-4' : ''}`}>
          {line}
        </p>
      )),
    });

    return items;
  }, [t, application.communityInterest, application.skillsInterest]);

  return (
    <>
      <header className="tw-font-bold tw-text-2xl tw-mb-8">{t('application:step-3.title')}</header>
      <dl className="tw-m-0">
        {formReviewItems.map(({ children, key, text, value }, index) => (
          <FormDefinitionListItem key={key} even={index % 2 == 0} term={text} definition={value}>
            {children}
          </FormDefinitionListItem>
        ))}
      </dl>
    </>
  );
};

const DataNotFound = (): JSX.Element => {
  const { t } = useTranslation();
  return <span className="tw-font-bold tw-italic">{t('common:data-not-found')}</span>;
};
