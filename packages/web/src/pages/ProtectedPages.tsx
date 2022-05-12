import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import loadable from '@loadable/component';
import Box from '@mui/material/Box';

import { ProtectedRoute } from '../router/components';
import { RootState } from '../store';
import { AppDrawer, DrawerHeader } from './shared-components/Drawer';
import { User } from './Main/mainSlice';

const Main = loadable(() => import('./Main/Main'));
const Editor = loadable(() => import('./Editor/Editor'));

export function ProtectedPages() {
  const user = useSelector<RootState, User>((s) => s.main.user, shallowEqual);

  return (
    <Box>
      <AppDrawer
        title={user?.name}
        logoSrc={user?.avatarId}
        handleLogOut={() => {
          // @ts-ignore
          // actions.logout();
        }}
      />
      <Box>
        <DrawerHeader />
        <ProtectedRoute exact path="/" component={Main} redirectTest={undefined} />
        <ProtectedRoute exact path="/editor/:noteId" component={Editor} redirectTest={undefined} />
      </Box>
    </Box>
  );
}
