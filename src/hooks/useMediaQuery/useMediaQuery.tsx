import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);

      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      const listener = (): void => {
        setMatches(media.matches);
      };

      media.addEventListener('change', listener);

      return () => media.removeEventListener('change', listener);
    }
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;
