/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextSeo } from 'next-seo';
import { MainLayout } from '../components/layouts/main/MainLayout';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

const PrivacyNoticeStatementPage = (): JSX.Element => {
  const { locale } = useRouter();

  return <MainLayout>{locale === 'fr' ? <PrivacyNoticeStatementFr /> : <PrivacyNoticeStatementEn />}</MainLayout>;
};

const PrivacyNoticeStatementEn = (): JSX.Element => {
  return (
    <>
      <NextSeo title={'Privacy Notice Statement'} />
      {'Privacy Notice Statement'}
    </>
  );
};

const PrivacyNoticeStatementFr = (): JSX.Element => {
  return (
    <>
      <NextSeo title={"Déclaration d'avis de confidentialité"} />
      {"Déclaration d'avis de confidentialité"}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default PrivacyNoticeStatementPage;
