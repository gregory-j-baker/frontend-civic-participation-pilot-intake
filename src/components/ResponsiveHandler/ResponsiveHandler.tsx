import { useEffect } from 'react';
import { theme } from '../../config';
import useCurrentBreakpoint from '../../hooks/useCurrentBreakpoint';

const ResponsiveHandler = (): JSX.Element => {
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

export default ResponsiveHandler;
