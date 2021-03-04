/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class',
  theme: {
    fontFamily: {
      sans: ['"Noto Sans"', 'sans-serif'],
    },
    screens: {
      sm: '768px',
      md: '992px',
      lg: '1200px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  prefix: 'tw-',
  corePlugins: {
    fontFamily: false,
  },
};
