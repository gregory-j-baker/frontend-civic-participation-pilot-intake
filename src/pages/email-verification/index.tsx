/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import { Button, ButtonOnClickEvent } from '../../components/Button';
import { TextField, TextFieldOnChangeEvent } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';

interface FormDataState {
  [key: string]: string | number | undefined;
  verificationCode?: string;
  attempts: number;
}

const EmailVerfication: NextPage = () => {
  const { t } = useTranslation();

  const [formData, setFormDataState] = useState<FormDataState>({ attempts: 0 });

  const onFieldChange: TextFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      return { ...prev, [field as keyof FormDataState]: value ?? undefined };
    });
  };

  const handleOnSubmit: ButtonOnClickEvent = (event) => {
    event.preventDefault();

    setFormDataState((prev) => ({ ...prev, attempts: ++prev.attempts }));
  };

  return (
    <MainLayout showBreadcrumb={false}>
      <NextSeo title={t('email-verification:page.title')} />
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
            {t('email-verification:page.title')}
          </h1>
          <h2 className="tw-border-none tw-m-0 tw-mb-4 tw-text-2xl">{t('email-verification:page.header')}</h2>

          <p className="tw-m-0 ">{t('email-verification:page.description')}</p>

          <div className="tw-my-16">
            <TextField
              field={nameof<FormDataState>((o) => o.verificationCode)}
              label={t('email-verification:form.verification-code')}
              helperText={t('email-verification:form.verification-code-attempts', { attempts: formData.attempts, maxAttempts: 5 })}
              value={formData.verificationCode}
              onChange={onFieldChange}
              required
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />
          </div>

          <div className="tw-flex tw-flex-wrap">
            <Button onClick={handleOnSubmit} className="tw-m-2">
              {t('email-verification:form.submit')}
            </Button>
            <Button outline onClick={(event) => console.log(event)} className="tw-m-2">
              {t('email-verification:form.cancel')}
            </Button>
          </div>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_authentication_fsn5.svg" alt="" layout="fill" />
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailVerfication;
