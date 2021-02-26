/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */
import type { NextPage } from 'next';
import MainLayout from '../components/layouts/main/MainLayout';
import { applicationConfig } from '../config';

const Home: NextPage = () => {
  return (
    <MainLayout>
      <p>
        v{applicationConfig.version}-{applicationConfig.gitCommit}
      </p>
    </MainLayout>
  );
};

export default Home;
