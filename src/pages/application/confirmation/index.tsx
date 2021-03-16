import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import * as Yup from 'yup';
import { Button, ButtonOnClickEvent } from '../../../components/Button';
import { MainLayout } from '../../../components/layouts/main/MainLayout';

const ApplicationConfirmationPage = (): JSX.Element => {
  const { t } = useTranslation();

  const handleOnSubmit: ButtonOnClickEvent = (event) => {
    event.preventDefault();
  };

  return (
    <MainLayout showBreadcrumb={false}>
      <div className="tw-flex tw-space-x-10">
        <div className="tw-w-full md:tw-w-1/2">
          <NextSeo title={t('application:confirmation.title')} />
          <h1 id="wb-cont" className="tw-m-0 tw-border-none tw-mb-8 tw-text-3xl">
            {t('application:confirmation.header')}
          </h1>
          <h2 className="tw-m-0 tw-border-none tw-mb-16 tw-text-2xl">{t('application:confirmation.sub-header')}</h2>
          <p className="tw-mb-16">{t('application:confirmation.sub-header')}</p>

          <Button onClick={handleOnSubmit}>{t('application:confirmation.submit')}</Button>
        </div>
        <div className="tw-hidden md:tw-block tw-w-1/2 tw-relative">
          <Image src="/img/undraw_Mailbox_re_dvds.svg" alt="" layout="fill" />
        </div>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code } = query;

  const codeSchema = Yup.string().uuid().required();

  if (await codeSchema.isValid(code)) {
    return {
      props: {},
    };
  }

  return { notFound: true };
};

export default ApplicationConfirmationPage;
