/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import { Box, Typography, useTheme } from '@material-ui/core';
import { NextPage } from 'next';
import Image from 'next/image';
import { applicationConfig } from '../config';

const Home: NextPage = () => {
  const theme = useTheme();

  return (
    <Box className="App">
      <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" minHeight="100vh" padding="3vh 3vw" textAlign="center">
        <Typography component="h1" variant="h2" style={{ fontVariant: 'small-caps' }}>
          Canada Service Corps
        </Typography>

        <Typography component="p" variant="subtitle1" color="textSecondary">
          The power to make an impact
        </Typography>

        <Image src="/img/maple-leaf.png" alt="logo" width={289} height={340} />
      </Box>

      <Box borderColor="text.secondary" borderLeft="thin solid" borderTop="thin solid" borderRadius="5px 0 0 0" bottom="0" color="text.secondary" padding="0 8px" position="fixed" right="0" style={{ backgroundColor: theme.palette.background.default }}>
        <Typography variant="caption">
          v{applicationConfig.version}-{applicationConfig.gitCommit}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
