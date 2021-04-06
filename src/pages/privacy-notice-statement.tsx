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
import React from 'react';
import Link from 'next/link';

const PrivacyNoticeStatementPage = (): JSX.Element => {
  const { locale } = useRouter();

  return <MainLayout>{locale === 'fr' ? <PrivacyNoticeStatementFr /> : <PrivacyNoticeStatementEn />}</MainLayout>;
};

const PrivacyNoticeStatementEn = (): JSX.Element => {
  return (
    <>
      <NextSeo title={'Privacy Notice Statement'} />
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">Privacy Notice Statement</h2>

      <p>
        The information you provide on this form is collected under the authority of the <em>Department of Employment and Social Development Canada Act</em> to determine your eligibility for and manage the Civic Participation Pilot -{' '}
        <em>Youth Leadership Initiative</em>.The information you provide will be used for administrative purposes, and may be used for policy analysis, research and evaluation. Your information is protected by the{' '}
        <em>Privacy Act and the Department of Employment and Social Development Act</em>.
      </p>

      <h3>Use of your personal information</h3>

      <p>
        To determine your eligibility and contact you, we collect your name, email address, year of birth to certify age of majority, official language of choice for participating in the pilot, citizenship status and province of residence. We request, but
        do not require, other demographic information that will be aggregated and used to support the evaluation of the outreach method for the pilot and inform policy decisions. If you are selected to participate in the pilot, your answers to the
        expression of interest questions may be used to guide pilot activities.
      </p>

      <h3>Disclosure of your personal information</h3>

      <p>If you participate in the pilot, we may share your contact information with third parties contracted to support the delivery of the pilot, such as for technology supports and program evaluation.</p>

      <h3>Your Privacy is Protected</h3>

      <p>We’ve taken steps to protect your privacy and data. We will:</p>
      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">only collect information required</li>
        <li className="tw-mb-2">keep your information safe</li>
        <li className="tw-mb-2">keep accurate records</li>
        <li className="tw-mb-2">never share your information without your explicit permission</li>
      </ul>

      <p>You have ways to protect your information. You can at any time:</p>
      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">Ask to view your information</li>
        <li className="tw-mb-2">Ask to change your information</li>
        <li className="tw-mb-2">Submit a complaint if you don’t think we’re handling your information appropriately.</li>
      </ul>

      <p>
        You can contact the Civic Participation Pilot – Youth Leadership Initiative team if you have questions or concerns:{' '}
        <a href="mailto:ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca">ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca</a>. If you have a complaint about how your information is handled by ESDC, you may file
        a complaint with the{' '}
        <Link href="https://www.priv.gc.ca/en/">
          <a>Office of the Privacy Commissioner</a>
        </Link>
        .
      </p>
    </>
  );
};

const PrivacyNoticeStatementFr = (): JSX.Element => {
  return (
    <>
      <NextSeo title={'Énoncé d’avis de confidentialité'} />
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">Énoncé d’avis de confidentialité</h2>

      <p>
        Les renseignements que vous fournissez dans ce formulaire sont recueillis en vertu de la <em>Loi sur le ministère de l&apos;Emploi et du Développement social Canada</em> afin de déterminer votre admissibilité et de gérer le Projet pilote de
        participation civique - <em>Initiative de leadership pour les jeunes</em>. Les renseignements que vous fournissez seront utilisés à des fins administratives, et peuvent être utilisés pour l&apos;analyse, la recherche et l&apos;évaluation des
        politiques. Vos renseignements sont protégés par la <em>Loi sur la protection des renseignements personnels et la Loi sur le ministère de l&apos;Emploi et du Développement social</em>.
      </p>

      <h3>Utilisation de vos renseignements personnels</h3>

      <p>
        Pour déterminer votre admissibilité et vous contacter, nous recueillons votre nom, votre adresse courriel, votre année de naissance pour certifier l&apos;âge de la majorité, la langue officielle de choix pour participer au projet pilote, le statut
        de de citoyenneté et la province de résidence. Nous demandons, mais nexigeons pas, d&apos;autres informations démographiques qui seront agrégées et utilisées pour soutenir l&apos;évaluation de la méthode de sensibilisation pour le projet pilote et
        éclairer décisions politiques. Si vous êtes sélectionné pour participer au projet pilote, vos réponses aux questions d&apos;expression d&apos;intérêt peuvent être utilisées pour guider les activités du projet pilote.
      </p>

      <h3>Divulgation de vos renseignements personnels</h3>

      <p>Si vous participez au projet pilote, nous pouvons partager vos coordonnées avec des tiers sous contrat pour soutenir la livraison du projet pilote, par exemple pour le soutien technologique et l&apos;évaluation du programme.</p>

      <h3>Votre vie privée est protégée</h3>

      <p>Nous avons pris des mesures pour protéger votre vie privée et vos données. Nous :</p>
      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">recueillerons uniquement les informations requises</li>
        <li className="tw-mb-2">garderons vos renseignements personnels en sécurité</li>
        <li className="tw-mb-2">tiendrons des registres précis</li>
        <li className="tw-mb-2">ne partagerons jamais vos renseignements personnels sans votre autorisation explicite</li>
      </ul>

      <p>Vous disposez de moyens pour protéger vos renseignements personnels. Vous pouvez à tout moment :</p>
      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">demander à voir vos renseignements personnels</li>
        <li className="tw-mb-2">demander à modifier vos renseignements personnels</li>
        <li className="tw-mb-2">soumettre une réclamation si vous pensez que nous ne traitons pas vos renseignements personnels de manière appropriée.</li>
      </ul>

      <p>
        Vous pouvez communiquer avec l&apos;équipe du Projet pilote de participation civique - Initiative de leadership pour les jeunes si vous avez des questions ou des préoccupations :
        <a href="mailto:EDSC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca">EDSC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca</a>. Si vous avez une plainte à formuler concernant la façon dont vos renseignements
        personnels sont traités par EDSC, vous pouvez déposer une plainte auprès du{' '}
        <Link href="https://www.priv.gc.ca/fr/">
          <a>Commissariat à la protection de la vie privée</a>
        </Link>
        .
      </p>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default PrivacyNoticeStatementPage;
