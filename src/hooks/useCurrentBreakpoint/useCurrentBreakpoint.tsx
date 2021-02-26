import { useState, useEffect } from 'react';
import { theme } from '../../config';
import useWindowSize from '../useWindowSize';

const useCurrentBreakpoint = (): number | undefined => {
  const { xxsmallview, xsmallview, smallview, mediumview, largeview, xlargeview } = theme.breakpoints;
  const { width } = useWindowSize();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (width === undefined) setCurrentBreakpoint(undefined);
    else if (width >= xlargeview) setCurrentBreakpoint(xlargeview);
    else if (width >= largeview && width < xlargeview) setCurrentBreakpoint(largeview);
    else if (width >= mediumview && width < largeview) setCurrentBreakpoint(mediumview);
    else if (width >= smallview && width < mediumview) setCurrentBreakpoint(smallview);
    else if (width >= xsmallview && width < smallview) setCurrentBreakpoint(xsmallview);
    else if (width < xsmallview) setCurrentBreakpoint(xxsmallview);
  }, [width, xxsmallview, xsmallview, smallview, mediumview, largeview, xlargeview]);

  return currentBreakpoint;
};

export default useCurrentBreakpoint;
