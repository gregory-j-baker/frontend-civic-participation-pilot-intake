/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect } from 'react';
import { theme } from '../config';
import { useWindowSize } from './useWindowSize';

export const useCurrentBreakpoint = (): number | undefined => {
  const { xs, sm, md, lg } = theme.breakpoints;
  const { width } = useWindowSize();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (width === undefined) setCurrentBreakpoint(undefined);
    else if (width >= lg) setCurrentBreakpoint(lg);
    else if (width >= md && width < lg) setCurrentBreakpoint(md);
    else if (width >= sm && width < md) setCurrentBreakpoint(sm);
    else if (width < sm) setCurrentBreakpoint(xs);
  }, [width, xs, sm, md, lg]);

  return currentBreakpoint;
};
