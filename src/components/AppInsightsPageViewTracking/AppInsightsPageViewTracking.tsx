/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';

export const AppInsightsPageViewTracking = (): JSX.Element => {
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
