/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { GetStaticProps, NextPage } from 'next';
import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../../common/HttpClientResponseError';
import { Alert, AlertType } from '../../../components/Alert';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import { TextField, TextFieldOnChangeEvent } from '../../../components/form/TextField';
import { MainLayout } from '../../../components/layouts/main/MainLayout';
import { apiConfig } from '../../../config';
import { EmailVerificationAccessCodeData, useSubmitAccessCode } from '../../../hooks/api/email-verifications/useSubmitAccessCode';
import { emailVerificationSchema } from '../../../yup/emailVerificationSchema';
import { YupCustomMessage } from '../../../yup/yup-custom';
import Custom404 from '../../404';
import Error from '../../_error';
import { Constants } from '../types';
import { PageLoadingSpinner } from '../../../components/PageLoadingSpinner';
import { ButtonLink } from '../../../components/ButtonLink';

interface FormDataState {
  accessCode?: string;
  attempts: number;
  email?: string;
}

/**
 * Maximum number of email verification attempts allowed by the API.
 */
const maxAttempts = apiConfig.maxEmailVerificationAttempts;

const EmailVerficationPage: NextPage = () => {
  const { t } = useTranslation('email-verification');
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();
  const [formData, setFormDataState] = useState<FormDataState>({ accessCode: undefined, attempts: maxAttempts, email: undefined });

  const { mutate: submitAccessCode, error: submitAccessCodeError, reset: resetSubmitAccessCodeError, isLoading: submitAccessCodeIsLoading, isSuccess: submitAccessCodeIsSuccess } = useSubmitAccessCode({
    onSuccess: () => {
      sessionStorage.removeItem(Constants.EmailVerificationStorageKey);
      router.push('/application/email-verification/success');
    },
    onError: (HttpClientResponseError) => {
      if (HttpClientResponseError.responseJson.verificationCount >= maxAttempts) {
        sessionStorage.removeItem(Constants.EmailVerificationStorageKey);
        router.push('/application/email-verification/failed');
      }

      setFormDataState((prev) => ({ ...prev, attempts: maxAttempts - HttpClientResponseError.responseJson.verificationCount }));
      if (submitAccessCodeError) document.getElementById('validation-error')?.focus();
    },
  });

  const handleOnTextFieldChange: TextFieldOnChangeEvent = ({ value }) => setFormDataState((prev) => ({ ...prev, accessCode: value ?? undefined }));

  const handleOnSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    resetSubmitAccessCodeError();
    setSchemaErrors(null);

    try {
      await emailVerificationSchema.validate(formData, { abortEarly: false });

      // submit email verification form
      const emailVerificationAccessCodeData: EmailVerificationAccessCodeData = {
        email: formData.email as string,
        accessCode: formData?.accessCode as string,
      };

      submitAccessCode(emailVerificationAccessCodeData);
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
      document.getElementById('validation-error')?.focus();
    }
  };

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return t('common:error-number', { number: index + 1 }) + t(`email-verification:form.${schemaErrors[index]?.path}.${key}`);
  };

  useEffect(() => {
    setFormDataState((prev) => ({ ...prev, email: window.sessionStorage.getItem(Constants.EmailVerificationStorageKey) as string }));
    setPageLoading(false);
  }, []);

  if (submitAccessCodeError instanceof HttpClientResponseError && ![400, 429].includes((submitAccessCodeError as HttpClientResponseError).responseStatus)) {
    return <Error err={submitAccessCodeError as HttpClientResponseError} />;
  }

  if (!pageLoading && !formData.email) return <Custom404 />;

  return (
    <MainLayout showAppTitle={false}>
      <NextSeo title={t('email-verification:page.title')} />
      {pageLoading ? (
        <PageLoadingSpinner />
      ) : (
        <div className="tw-flex tw-space-x-10">
          <div className="tw-w-full md:tw-w-1/2">
            <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
              {t('email-verification:page.title')}
            </h1>
            <h2 className="tw-border-none tw-m-0 tw-mb-4 tw-text-2xl">{t('email-verification:page.header')}</h2>

            <p className="tw-m-0 tw-mb-4">{t('email-verification:page.description')}</p>

            {schemaErrors && schemaErrors.length > 0 && (
              <Alert title={t('common:error-form-cannot-be-submitted', { count: schemaErrors.length })} type={AlertType.danger}>
                <ul className="tw-list-disc">
                  {schemaErrors.map(({ path }) => {
                    const [field] = path?.split('.') ?? [];

                    return path ? (
                      <li key={path} className="tw-my-2">
                        <a href={`#form-field-${field}`}>{getSchemaError(path)}</a>
                      </li>
                    ) : undefined;
                  })}
                </ul>
              </Alert>
            )}

            {submitAccessCodeError && (
              <Alert title={t('common:error-form-cannot-be-submitted', { count: 1 })} type={AlertType.danger}>
                <ul className="tw-list-disc">
                  <li key="{path}" className="tw-my-2">
                    <a href="#form-field-accessCode">{t('email-verification:form.accessCode.invalid')}</a>
                  </li>
                </ul>
              </Alert>
            )}

            <div className="tw-my-16">
              <TextField
                field={nameof<FormDataState>((o) => o.accessCode)}
                label={t('email-verification:form.accessCode.label')}
                helperText={t('email-verification:form.accessCode.help-text', { attempts: formData?.attempts, maxAttempts: 5 })}
                value={formData?.accessCode}
                onChange={handleOnTextFieldChange}
                disabled={submitAccessCodeIsLoading || submitAccessCodeIsSuccess}
                required
                className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
              />
            </div>

            <div className="tw-flex tw-flex-wrap">
              <Button onClick={handleOnSubmit} disabled={submitAccessCodeIsLoading || submitAccessCodeIsSuccess} className="tw-m-2">
                {t('email-verification:form.submit')}
              </Button>
              <ButtonLink href="/application/confirmation" outline disabled={submitAccessCodeIsLoading || submitAccessCodeIsSuccess} className="tw-m-2">
                {t('email-verification:form.cancel')}
              </ButtonLink>
            </div>
          </div>
          <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
            <Image src="/img/undraw_authentication_fsn5.svg" alt="" layout="fill" />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default EmailVerficationPage;
