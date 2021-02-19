/**
 * Copyright (c) Employment and Social Development Canada and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @author Greg Baker <gregory.j.baker@hrsdc-rhdcc.gc.ca>
 */

import { Box, Button, Typography, useTheme } from '@material-ui/core';
import type { NextPage } from 'next';
import type { Session } from 'next-auth/client';
import { signIn, signOut, useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { applicationConfig } from '../config';

const Home: NextPage = () => {
  const [session] = useSession();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Box alignItems="center" display="flex" flexDirection="column" justifyContent="center" minHeight="100vh" padding="3vh 3vw" textAlign="center">
        <Typography component="h1" variant="h2" style={{ fontVariant: 'small-caps' }}>
          {t('common:app.title')}
        </Typography>

        <Typography component="p" variant="subtitle1" color="textSecondary">
          {t('home:page.header')}
        </Typography>

        <Image src="/img/maple-leaf.png" alt="logo" width={289} height={340} />

        <AuthInfo session={session} />
      </Box>

      <Box borderColor="text.secondary" borderLeft="thin solid" borderTop="thin solid" borderRadius="5px 0 0 0" bottom="0" color="text.secondary" padding="0 8px" position="fixed" right="0" style={{ backgroundColor: theme.palette.background.default }}>
        <Typography variant="caption">
          v{applicationConfig.version}-{applicationConfig.gitCommit}
        </Typography>
      </Box>
    </>
  );
};

const AuthInfo: NextPage<{ session: Session | null | undefined }> = ({ session }) => {
  const { t } = useTranslation();

  return (
    <>
      {!session && (
        <Box component="p">
          <Button variant="contained" color="primary" onClick={() => signIn('canada-service-corps')}>
            {t('home:auth-info.sign-in')}
          </Button>
        </Box>
      )}
      {session && (
        <>
          <Typography component="p">
            {t('home:auth-info.sign-in-as')} <strong>{session.user.email}</strong>
          </Typography>

          <Box component="p">
            <Button variant="contained" color="secondary" onClick={() => signOut()}>
              {t('home:auth-info.sign-out')}
            </Button>
          </Box>

          <Typography component="p" variant="h6">
            {t('home:auth-info.session')}
          </Typography>

          <Box component="pre" style={{ backgroundColor: '#666', border: 'thin solid black', borderRadius: '5px', color: '#000', overflow: 'scroll', padding: '0.5rem', textAlign: 'left', width: '350px' }}>
            {JSON.stringify(session, null, 2)}
          </Box>
        </>
      )}
    </>
  );
};

export default Home;
