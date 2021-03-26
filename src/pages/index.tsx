/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetStaticProps } from 'next';

const HomePage = (): JSX.Element => <></>;

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: `/application`,
      permanent: false,
    },
  };
};

export default HomePage;
