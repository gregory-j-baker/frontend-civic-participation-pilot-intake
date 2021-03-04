/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { NextPage, NextPageContext } from 'next';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';
import { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';

export enum SourceEnum {
  Client,
  Server,
}

interface ErrorProps {
  statusCode?: number;
  err?: Error | null;
  source?: SourceEnum;
}

const Error: NextPage<ErrorProps> = ({ statusCode, err, source }) => {
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
