/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import { ApplicationInsights as AppInsightsWeb } from '@microsoft/applicationinsights-web';
import { applicationConfig } from '../config';

export const AppInsightsPageViewTracking = (): JSX.Element => {
  const { appInsightsInstrumentationKey } = applicationConfig;

  useEffect(() => {
    if (appInsightsInstrumentationKey) {
      const appInsightsWeb = new AppInsightsWeb({
        config: {
          instrumentationKey: appInsightsInstrumentationKey,
          /* ...Other Configuration Options... */
        },
      });

      appInsightsWeb.loadAppInsights();
      appInsightsWeb.trackPageView();
    }
  }, [appInsightsInstrumentationKey]);

  return <></>;
};
