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
import { CheckboxeField } from '../../../components/form/CheckboxeField';

interface SelectionState {
  attested: boolean;
  count: number;
  error: string;
}

const ManagementApplicationsSelectPage = (): JSX.Element => {
  const { t } = useTranslation();

  const [selectState, setSelectState] = useState<SelectionState>({ attested: false, count: 0, error: '' });
  const [selectionResult, setSelectionResult] = useState<number>(-1);

  const { mutate: selectApplications, isLoading: selectionInProgress } = useSelectApplications({
    onSuccess: (data) => {
      setSelectionResult(data);
    },
    onError: (error) => {
      setSelectState((prev) => ({ ...prev, error: error.message }));
    },
  });

  const currentSelectionReceived = (current: number): void => {
    setSelectState((prev) => ({ ...prev, count: 200 - current }));
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
        setSelectState((prev) => ({ ...prev, count: Number(value) }));
      }
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSelectState((prev) => ({ ...prev, count: 0 }));
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
            <ContentPaper className="tw-space-y-10">
              <h3 className="tw-font-bold tw-text-xl tw-m-0 tw-mb-8">{t('application:management.select.currentCount', { number: participantCount ?? 0 })}</h3>
              <div className="tw-mb-10">
                <label htmlFor="selectionCountInput" className="tw-block w-full text-gray-700 text-sm font-semibold">
                  {t('application:management.select.countLabel')}
                </label>
                <input
                  className={`border border-transparent tw-ring-2 ${selectState.count > 0 ? 'tw-ring-green-600' : 'tw-ring-red-600'} focus:tw-outline-none focus:tw-border-transparent`}
                  type="number"
                  min={0}
                  name="selectionCountInput"
                  value={selectState.count}
                  onChange={handleCountChange}
                />
              </div>
              <CheckboxeField field="attested" label={t('application:management.select.attestation')} checked={selectState.attested} onChange={({ checked }) => setSelectState((prev) => ({ ...prev, attested: checked }))} required gutterBottom />
              <ul className="tw-flex tw-justify-between">
                <li>
                  <ButtonLink className="tw-m-2" href="/management/applications" outline>
                    {t('application:management.select.cancel')}
                  </ButtonLink>
                </li>
                <li>
                  <Button className="tw-m-2" onClick={handleSelectionSubmit} disabled={!selectState.attested || !(selectState.count > 0)}>
                    {t('application:management.select.submit')}
                  </Button>
                </li>
              </ul>
            </ContentPaper>
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
