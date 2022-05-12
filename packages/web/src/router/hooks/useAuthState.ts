import { shallowEqual, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { User } from '../../pages/Main/mainSlice';

export function useAuthState() {
  const { isAuthenticated, user } = useSelector<RootState, { user: User; isAuthenticated: boolean }>(
    (state) => ({
      isAuthenticated: state.main.isAuthenticated,
      user: state.main.user,
    }),
    shallowEqual,
  );

  return { isAuthenticated, user };
}
