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
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import Alert, { AlertType } from '../../components/Alert/Alert';
import { Button, ButtonOnClickEvent } from '../../components/Button';
import { TextField, TextFieldOnChangeEvent } from '../../components/form/TextField';
import { MainLayout } from '../../components/layouts/main/MainLayout';
import { contactUsSchema } from '../../yup/contactUsSchema';
import { ValidationError } from 'yup';
import { YupCustomMessage } from '../../yup/yup-custom';
import { GetStaticProps } from 'next';
import useSubmitContactUs from '../../hooks/api/useSubmitContactUs';

interface FormDataState {
  [key: string]: string | undefined;
  email?: string;
  message?: string;
  name?: string;
  phoneNumber?: string;
}

const ContactUs: NextPage = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { isLoading: isSubmitting, mutate: submitContactUs } = useSubmitContactUs();

  const [schemaErrors, setSchemaErrors] = useState<ValidationError[] | null>();

  const [formData, setFormDataState] = useState<FormDataState>();

  const handleOnTextFieldChange: TextFieldOnChangeEvent & TextAreaFieldOnChangeEvent = ({ field, value }) => {
    setFormDataState((prev) => {
      return { ...prev, [field as keyof FormDataState]: value ?? undefined };
    });
  };

  const handleOnSubmit: ButtonOnClickEvent = async (event) => {
    event.preventDefault();

    setFormDataState((prev) => ({ ...prev }));

    // validate
    try {
      await contactUsSchema.validate(formData, { abortEarly: false });

      if (await contactUsSchema.validate(formData)) {
        // submit contact form
        submitContactUs({
          ...formData,
        });

        router.push(`/contact-us/success`, undefined, { shallow: true });
      }
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

    return (
      t('common:error-number', { number: index + 1 }) +
      t(
        `contact-us:form.${schemaErrors[index]?.path
          ?.split('.')
          .map((el) => kebabCase(el))
          .join('.')}.${key}`
      )
    );
  };

  return (
    <MainLayout showBreadcrumb={false}>
      <NextSeo title={t('contact-us:page.title')} />
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-16 tw-text-3xl">
            {t('contact-us:page.header')}
          </h1>
          <h2 className="tw-m-0 tw-border-none tw-mb-8 tw-text-2xl">{t('contact-us:page.sub-header')}</h2>
          {schemaErrors && schemaErrors.length > 0 && (
            <Alert title={t('common:error-form-cannot-be-submitted', { count: schemaErrors.length })} type={AlertType.danger}>
              <ul className="tw-list-disc">
                {schemaErrors.map(({ path }) => {
                  const [field] = path?.split('.') ?? [];

                  return path ? (
                    <li key={path} className="tw-my-2">
                      <a href={`#form-field-${camelCase(field)}`}>{getSchemaError(path)}</a>
                    </li>
                  ) : undefined;
                })}
              </ul>
            </Alert>
          )}

          <div className="tw-my-16">
            <TextField
              field={nameof<FormDataState>((o) => o.name)}
              label={t('contact-us:form.name.label')}
              value={formData?.name}
              onChange={handleOnTextFieldChange}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              error={getSchemaError(nameof<FormDataState>((o) => o.email))}
              required
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <TextField
              field={nameof<FormDataState>((o) => o.phoneNumber)}
              label={t('contact-us:form.phone-number.label')}
              value={formData?.phoneNumber}
              onChange={handleOnTextFieldChange}
              disabled={isSubmitting}
              error={getSchemaError(nameof<FormDataState>((o) => o.phoneNumber))}
              gutterBottom
              className="tw-w-full sm:tw-w-8/12 md:tw-w-6/12"
            />

            <TextAreaField
              field={nameof<FormDataState>((o) => o.message)}
              label={t('contact-us:form.message.label')}
              value={formData?.message}
              onChange={handleOnTextFieldChange}
              disabled={isSubmitting}
              error={getSchemaError(nameof<FormDataState>((o) => o.message))}
              required
              gutterBottom
              className="tw-w-full"
              wordLimit={250}
            />
          </div>

          <div className="tw-flex tw-flex-wrap">
            <Button onClick={handleOnSubmit} disabled={isSubmitting} className="tw-m-2">
              {t('contact-us:form.submit')}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default ContactUs;
