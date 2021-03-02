import React, { useEffect } from 'react';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';

const AppInsightsPageViewTracking: React.FC = () => {
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
      appInsightsWeb.trackPageView();
    }
  }, [instrumentationKey]);

  return <></>;
};

export default AppInsightsPageViewTracking;
