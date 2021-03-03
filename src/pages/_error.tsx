import { NextPage, NextPageContext } from 'next';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';
import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';

export enum SourceEnum {
  Client,
  Server,
}

interface IError {
  statusCode?: number;
  err?: Error | null;
  source?: SourceEnum;
}

const Error: NextPage<IError> = ({ statusCode, err, source }) => {
  const instrumentationKey = process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY;
  const { t } = useTranslation();

  useEffect(() => {
    if (instrumentationKey) {
      const appInsightsWeb = new AppInsightsWeb({
        config: {
          instrumentationKey,
          /* ...Other Configuration Options... */
        },
      });

      appInsightsWeb.loadAppInsights();
      appInsightsWeb.trackException({ exception: err === null ? undefined : err, properties: { statusCode } });
    }
  }, [instrumentationKey, statusCode, err]);

  if (source && source === SourceEnum.Server) {
    return <p>{statusCode ? t('common:error.server.with-status-code', { statusCode }) : t('common:error.server.without-status-code')}</p>;
  }

  return <p>{statusCode ? t('common:error.client.with-status-code', { statusCode }) : t('common:error.client.without-status-code')}</p>;
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res?.statusCode : err ? err.statusCode : 404;
  return { statusCode, err, source: SourceEnum.Server };
};

export default Error;
