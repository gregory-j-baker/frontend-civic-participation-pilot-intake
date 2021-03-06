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
        The personal information you provide via this form is collected under the authority of the <em>Department of Employment and Social Development Canada Act</em> to determine your eligibility and for administrative purposes relating to the Civic
        Participation Project. Your personal information may also be used in an anonymized format for policy analysis, research and evaluation, or some combination thereof to support future program development. Your personal information is administered in
        accordance with the <em>Privacy Act and the Department of Employment and Social Development Act and other applicable laws</em>. Your personal information will be described in the Personal Information Bank which is under development. You can learn
        more about how to access this information by visiting the Government of Canada website{' '}
        <em>
          <a href="https://www.canada.ca/en/treasury-board-secretariat/services/access-information-privacy/access-information/information-about-programs-information-holdings.html">Information about programs and information holdings</a>
        </em>
        . You can also visit a Service Canada Centre to access this information.
      </p>

      <h3>Use of your personal information</h3>

      <p>
        We collect your name, email address, year of birth, citizenship status, province or territory of residence, and choice of official language in order to determine your eligibility and to contact you should you be selected to participate. We request,
        but do not require, other personal information that will be used in an anonymized format to assess program outreach effectiveness that may be used to inform similar initiatives in the future. If you are selected to participate in the pilot, this
        anonymized personal information will also be used to guide the development of training material.
      </p>

      <h3>Disclosure of your personal information</h3>

      <p>If you participate in the pilot, we may share your contact information with third parties contracted to support the delivery of the pilot, namely the digital platform and any related technology supports.</p>

      <p>You have ways to protect your information. You can at any time:</p>

      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">Ask to view your information</li>
        <li className="tw-mb-2">Submit a complaint if you don???t think we???re handling your information appropriately.</li>
      </ul>

      <p>
        You can contact the Civic Participation Pilot ??? Youth Leadership Initiative team if you have questions or concerns:{' '}
        <a href="mailto:ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca">ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca</a>. If you have a complaint about how your information is handled by ESDC, you may file
        a complaint with the <a href="https://www.priv.gc.ca/en/">Office of the Privacy Commissioner</a>.
      </p>
    </>
  );
};

const PrivacyNoticeStatementFr = (): JSX.Element => {
  return (
    <>
      <NextSeo title={'??nonc?? d???avis de confidentialit??'} />
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">Avis de confidentialit??</h2>

      <p>
        Les renseignements personnels que vous fournissez via ce formulaire sont recueillis en vertu de la <em>Loi sur le minist??re de l&apos;Emploi et du D??veloppement social du Canada</em> afin de d??terminer votre admissibilit?? au Projet pilote de la
        participation civique et ?? des fins administratives. Vos renseignements personnels peuvent ??galement ??tre utilis??s sous format anonyme pour l&apos;analyse, la recherche et l&apos;??valuation des politiques, ou une combinaison de ceux-ci pour
        soutenir le d??veloppement futur du programme. Vos renseignements personnels sont administr??s conform??ment ?? la Loi sur la protection des renseignements personnels, ?? la{' '}
        <em>Loi sur le minist??re de l&apos;Emploi et du D??veloppement social et aux autres lois applicables</em>. Vos renseignements personnels seront d??crits dans le Fichier de renseignements personnels qui est sous-d??veloppement. Pour en savoir plus sur
        comment acc??der ?? ces renseignements, visitez le site Web du gouvernement du Canada{' '}
        <em>
          <a href="https://www.canada.ca/fr/secretariat-conseil-tresor/services/acces-information-protection-reseignements-personnels/acces-information/renseignements-programmes-fonds-renseignements.html">
            Renseignements sur les programmes et les fonds de renseignements
          </a>
        </em>
        . Vous pouvez ??galement visiter un Centre Service Canada pour acc??der ?? ces renseignements.
      </p>

      <h3>Utilisation de vos renseignements personnels</h3>

      <p>
        Nous recueillons votre nom, votre adresse ??lectronique, votre ann??e de naissance, statut de citoyennet??, province ou territoire de r??sidence et la langue officielle de votre choix pour d??termin?? votre ??ligibilit?? et pour vous contacter si vous ??tes
        s??lectionn?? pour participer. Nous demandons, mais n&apos;exigeons pas, d&apos;autres renseignements personnels qui seront dans un format anonyme pour ??valuer l&apos;efficacit?? de la m??thode de sensibilisation pour informer des initiatives
        similaires ?? l&apos;avenir. Si vous ??tes s??lectionn?? pour participer au projet pilote, ces informations personnelles rendues anonymes seront ??galement utilis??es pour guider l&apos;??laboration du mat??riel de formation.
      </p>

      <h3>Divulgation de vos renseignements personnels</h3>

      <p>
        Si vous participez au projet pilote, il se peut que nous partagions vos coordonn??es avec des tierces parties engag??s sous contrat pour soutenir la r??alisation du projet pilote, ?? savoir la plate-forme num??rique et tout support technologique
        associ??.
      </p>

      <p>Vous avez des moyens de prot??ger vos informations. Vous pouvez ?? tout moment :</p>
      <ul className="tw-list-disc tw-list-inside tw-my-4">
        <li className="tw-mb-2">demander ?? consulter vos renseignements</li>
        <li className="tw-mb-2">d??poser une plainte si vous pensez que nous ne traitons pas vos renseignements de mani??re appropri??e.</li>
      </ul>

      <p>
        Vous pouvez contacter l&apos;??quipe du Projet pilote de la participation civique ??? Une initiative de leadership pour les jeunes si vous avez des questions ou des pr??occupations :{' '}
        <a href="mailto:ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca">ESDC.CSC.Youth.Leadership-Leadership.Jeunes.SJC.EDSC@hrsdc-rhdcc.gc.ca</a>. Si vous avez une plainte ?? formuler sur la fa??on dont vos renseignements sont
        trait??s par EDSC, vous pouvez d??poser une plainte aupr??s du <a href="https://www.priv.gc.ca/fr/">Commissariat ?? la protection de la vie priv??e</a>.
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
