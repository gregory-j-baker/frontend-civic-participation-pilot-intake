/**
 * Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { GetStaticProps } from 'next';
import { ApplyState } from './[id]';
import kebabCase from 'lodash/kebabCase';

const ApplyIndex = (): JSX.Element => {
  return <></>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    redirect: { destination: `/apply/${kebabCase(nameof<ApplyState>((o) => o.personalInformation))}` },
  };
};

export default ApplyIndex;
