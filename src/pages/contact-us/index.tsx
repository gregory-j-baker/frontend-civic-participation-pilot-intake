/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { TextAreaField, TextAreaFieldOnChangeEvent } from '../../components/form/TextAreaField';
import useTranslation from 'next-translate/useTranslation';
import Error from '../_error';
import { Alert, AlertType } from '../../components/Alert';
import { Button, ButtonOnClickEvent } from '../../components/Button';
import { TextField, TextFieldOnChangeEvent } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { contactUsSchema } from '../../yup/contactUsSchema';
import { ValidationError } from 'yup';
import { HttpClientResponseError } from '../../common/HttpClientResponseError';
import { YupCustomMessage } from '../../yup/yup-custom';
import { GetStaticProps } from 'next';
import { ContactUsData, useSubmitContactUs } from '../../hooks/api/contact-form/useSubmitContactUs';

interface FormDataState {
  email?: string;
  message?: string;
  name?: string;
  phoneNumber?: string;
}

const ContactUsPage: NextPage = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { mutate: submitContactUs, error: submitContactUsError, isLoading: submitContactUsIsLoading, isSuccess: submitContactUsIsSuccess } = useSubmitContactUs({
    onSuccess: () => {
      router.push('/contact-us/success');
    },
  });

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const [formData, setFormDataState] = useState<FormDataState>();

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => ({ ...prev, [field as keyof FormDataState]: value ?? undefined }));
  };

  const handleOnSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    // validate
    try {
      await contactUsSchema.validate(formData, { abortEarly: false });

      // submit contact form
      const contactUsData: ContactUsData = {
        email: formData?.email as string,
        message: formData?.message as string,
        name: formData?.name as string,
        phoneNumber: formData?.phoneNumber as string,
      };

      submitContactUs(contactUsData);
    } catch (err) {
      if (!(err instanceof ValidationError)) throw err;
      setSchemaErrors(err.inner);
    }
  };

  const getSchemaError = (path: string): string | undefined => {
    if (!schemaErrors || schemaErrors.length === 0) return undefined;

    const index = schemaErrors.findIndex((err) => err.path === path);

    if (index === -1) return undefined;

    const { key } = (schemaErrors[index]?.message as unknown) as YupCustomMessage;

    return t('common:error-number', { number: index + 1 }) + t(`contact-us:form.${schemaErrors[index]?.path}.${key}`);
  };

  if (submitContactUsError) return <Error err={submitContactUsError as HttpClientResponseError} />;

  return (
    <MainLayout showAppTitle={false}>
      <NextSeo title={t('contact-us:page.title')} />

      <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-10 tw-text-3xl">
        {t('contact-us:page.header')}
      </h1>
      <h2 className="tw-m-0 tw-mb-6 tw-text-2xl">{t('contact-us:page.sub-header')}</h2>

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

      <TextField
        field={nameof<FormDataState>((o) => o.name)}
        label={t('contact-us:form.name.label')}
        value={formData?.name}
        onChange={handleOnTextFieldChange}
        disabled={submitContactUsIsLoading || submitContactUsIsSuccess}
        error={getSchemaError(nameof<FormDataState>((o) => o.name))}
        required
        gutterBottom
        className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
      />

      <TextField
        field={nameof<FormDataState>((o) => o.email)}
        label={t('contact-us:form.email.label')}
        value={formData?.email}
        onChange={handleOnTextFieldChange}
        disabled={submitContactUsIsLoading || submitContactUsIsSuccess}
        error={getSchemaError(nameof<FormDataState>((o) => o.email))}
        required
        gutterBottom
        className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
      />

      <TextField
        field={nameof<FormDataState>((o) => o.phoneNumber)}
        label={t('contact-us:form.phoneNumber.label')}
        helperText={t('contact-us:form.phoneNumber.helper-text')}
        value={formData?.phoneNumber}
        onChange={handleOnTextFieldChange}
        disabled={submitContactUsIsLoading || submitContactUsIsSuccess}
        error={getSchemaError(nameof<FormDataState>((o) => o.phoneNumber))}
        gutterBottom
        className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
      />

      <TextAreaField
        field={nameof<FormDataState>((o) => o.message)}
        label={t('contact-us:form.message.label')}
        value={formData?.message}
        onChange={handleOnTextFieldChange}
        disabled={submitContactUsIsLoading || submitContactUsIsSuccess}
        error={getSchemaError(nameof<FormDataState>((o) => o.message))}
        required
        gutterBottom
        className="tw-w-full"
        wordLimit={250}
      />

      <Button onClick={handleOnSubmit} disabled={submitContactUsIsLoading || submitContactUsIsSuccess}>
        {t('contact-us:form.submit')}
      </Button>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default ContactUsPage;
