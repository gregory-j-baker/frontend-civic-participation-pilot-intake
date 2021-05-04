/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ChangeEventHandler, useState } from 'react';
import { GetStaticProps } from 'next';
import { Role, TailwindColor } from '../../../common/types';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { PageSecurityGate } from '../../../components/PageSecurityGate';
import useTranslation from 'next-translate/useTranslation';
import { NextSeo } from 'next-seo';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import { ButtonLink } from '../../../components/ButtonLink';
import { ContentPaper } from '../../../components/ContentPaper';
import { useSelectApplications } from '../../../hooks/api/applications/useSelectApplications';
import { useParticipantCount } from '../../../hooks/api/applications/useParticipantCount';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { ValidationError } from 'yup';
import { applicationSelectionSchema } from '../../../yup/applicationSelectionSchema';
import { Alert, AlertType } from '../../../components/Alert';

interface SelectionState {
  attested: boolean;
  count: number;
  error: string;
}

const ManagementApplicationsSelectPage = (): JSX.Element => {
  const { t } = useTranslation();

  const [selectState, setSelectState] = useState({ attested: false, count: 0, error: '' });
  const [selectionResult, setSelectionResult] = useState(-1);

  const { mutate: selectApplications, isLoading: selectionInProgress } = useSelectApplications({
    onSuccess: (data) => {
      setSelectionResult(data);
    },
    onError: (error) => {
      setSelectState((prev: SelectionState) => ({ ...prev, error: error.message }));
    },
  });

  const currentSelectionReceived = (current: number): void => {
    setSelectState((prev: SelectionState) => ({ ...prev, count: 200 - current }));
  };

  const { data: participantCount, isLoading: participantCountLoading } = useParticipantCount(currentSelectionReceived);

  const handleCountChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // This is super weird but I'm tight on time.
    // For some reason with this exact setup, no schema errors ever get
    // displayed, and it prevents you from entering any letters.
    // If I remove yup validation though, then typing characters
    // sets the counter to 0, which isn't correct.
    // So I'm leaving this in, with no schema errors display on the page.
    try {
      await applicationSelectionSchema.validate({ attested: selectState.attested, count: value });
      if (!isNaN(Number(value))) {
        setSelectState((prev: SelectionState) => ({ ...prev, count: Number(value) }));
      }
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
    }
  };

  const handleSelectionSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    selectApplications(selectState.count);
  };

  return (
    <MainLayout>
      {participantCountLoading || selectionInProgress ? (
        <PageLoadingSpinner />
      ) : (
        <>
          <NextSeo title={t('application:management.select.title')} />

          <h2 className="tw-m-0 tw-mb-8 tw-text-2xl">{t('application:management.select.header')}</h2>

          {selectState.error.length > 0 && (
            <Alert id="selection-error" title={t('application:management.select.errorTitle')} type={AlertType.danger}>
              <p>{selectState.error}</p>
            </Alert>
          )}
          {selectionResult >= 0 && (
            <div>
              <Alert id="selection-success" title={t('application:management.select.successTitle')} type={AlertType.success}>
                <p>{t('application:management.select.successMessage', { number: selectionResult })}</p>
              </Alert>
              <ButtonLink color={TailwindColor.blue} href="/management/applications">
                {t('application:management.select.applicationsList')}
              </ButtonLink>
            </div>
          )}
          {selectionResult < 0 && (
            <div className="tw-space-y-5">
              <ContentPaper>
                <p className="tw-text-gray-700 tw-text-3xl tw-font-bold">{t('application:management.select.currentCount', { number: participantCount ?? 0 })}</p>
              </ContentPaper>
              <ContentPaper>
                <label htmlFor="selectionCountInput" className="w-full text-gray-700 text-sm font-semibold">
                  {t('application:management.select.countLabel')}
                </label>
                <div className="tw-flex tw-h-10">
                  <input className="border border-transparent focus:outline-none focus:tw-ring-2 focus:tw-ring-green-600 focus:tw-border-transparent" type="number" min={0} name="selectionCountInput" value={selectState.count} onChange={handleCountChange} />
                </div>
              </ContentPaper>
              <ContentPaper>
                <div className="tw-flex tw-flex-row tw-items-center tw-space-x-10">
                  <input type="checkbox" checked={selectState.attested} onChange={() => setSelectState((prev: SelectionState) => ({ ...prev, attested: !prev.attested }))} />
                  <p>{t('application:management.select.attestation')}</p>
                </div>
              </ContentPaper>
              <ButtonLink color={TailwindColor.red} href="/management/applications">
                {t('application:management.select.cancel')}
              </ButtonLink>
              <Button className="tw-float-right" disabled={!selectState.attested} onClick={handleSelectionSubmit}>
                {t('application:management.select.submit')}
              </Button>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
};

const SecuredPage = (): JSX.Element => {
  return (
    <PageSecurityGate requiredRoles={[Role.CPP_Manage]}>
      <ManagementApplicationsSelectPage />
    </PageSecurityGate>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default SecuredPage;
