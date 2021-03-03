import { useState, useEffect } from 'react';
import { theme } from '../../config';
import useWindowSize from '../useWindowSize';

const useCurrentBreakpoint = (): number | undefined => {
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

export default useCurrentBreakpoint;
