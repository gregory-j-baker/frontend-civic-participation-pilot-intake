import { NextPage, NextPageContext } from 'next';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';
import { useEffect } from 'react';

enum SourceEnum {
  Client,
  Server,
}

interface Props {
  statusCode?: number;
  err?: Error | null;
  source: SourceEnum;
}

const Error: NextPage<Props> = ({ statusCode, err, source }) => {
  const instrumentationKey = process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY;

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

  if (source === SourceEnum.Server) return <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on server'}</p>;
  return <p>{statusCode ? `An error ${statusCode} occurred on client` : 'An error occurred on client'}</p>;
};

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res?.statusCode : err ? err.statusCode : 404;
  return { statusCode, err, source: SourceEnum.Server };
};

Error.defaultProps = {
  source: SourceEnum.Client,
};

export default Error;
