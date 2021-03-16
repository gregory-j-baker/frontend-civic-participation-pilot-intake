/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetServerSideProps } from 'next';

const ApplicationIndex = (): JSX.Element => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/application/personal-information',
      permanent: false,
    },
  };
};

export default ApplicationIndex;
