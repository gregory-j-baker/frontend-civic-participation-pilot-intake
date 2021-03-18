/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { theme } from '../../config';
import { useCurrentBreakpoint } from '../../hooks/useCurrentBreakpoint';

export const ResponsiveHandler = (): JSX.Element => {
  const { breakpoints } = theme;
  const currentBreakpoint = useCurrentBreakpoint();

  // set html element class for breakpoint
  useEffect(() => {
    if (currentBreakpoint !== undefined) {
      const elHtml = document.querySelector('html');

      if (elHtml) {
        for (const [key, value] of Object.entries(breakpoints)) {
          if (value === currentBreakpoint) {
            elHtml.classList.add(key);
          } else {
            elHtml.classList.remove(key);
          }
        }
      }
    }
  }, [currentBreakpoint, breakpoints]);

  return <></>;
};
