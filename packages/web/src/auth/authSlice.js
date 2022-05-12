import { createSlice, getValueFromProxy } from '../redux-utils';

export const initialState = {
  // Is auth initialized?
  bootstrappingAuth: false,
  bootstrappedAuth: false,
  // Current logged user
  user: null,
  // Tokens
  accessToken: null,
  refreshToken: null,
  expires: null,
  // Login state
  loginLoading: false,
  loginError: null,
};

const { actions, reducer } = createSlice({
  name: '@auth',
  initialState,
  reducer: {
    loginLoading: (draft) => {
      draft.loginLoading = true;
      draft.loginError = null;
    },
    loginFailure: (draft, { payload }) => {
      draft.loginLoading = false;
      draft.loginError = payload;
    },
    clearLoginError: (draft) => {
      draft.loginError = null;
    },
    loginSuccess: (draft, { payload }) => {
      draft.loginLoading = false;
      draft.user = payload.user;
      draft.accessToken = payload.accessToken;
      draft.refreshToken = payload.refreshToken;
      draft.expires = payload.expires;
      // draft.logoutFromPermission = false
    },
    bootstrapAuthStart: (draft) => {
      draft.bootstrappingAuth = true;
    },
    bootstrapAuthEnd: (draft, { payload }) => {
      draft.bootstrappedAuth = true;
      draft.bootstrappingAuth = false;

      if (payload.authenticated) {
        const { user, accessToken, refreshToken = null, expires = null } = payload;

        draft.user = user;
        draft.accessToken = accessToken;
        draft.refreshToken = refreshToken;
        draft.expires = expires;
      }
    },
    setTokens: (draft, { payload }) => {
      draft.accessToken = payload.accessToken;
      draft.refreshToken = payload.refreshToken;
      draft.expires = payload.expires;
    },
    // eslint-disable-next-line sonarjs/no-identical-functions
    tokenRefreshed: (draft, { payload }) => {
      draft.accessToken = payload.accessToken;
      draft.refreshToken = payload.refreshToken;
      draft.expires = payload.expires;
    },
    updateUser: (draft, { payload }) => {
      draft.user = payload;
    },
    patchUser: (draft, { payload }) => {
      draft.user = {
        ...getValueFromProxy(draft.user),
        ...payload,
      };
    },
    logout: (draft, { payload }) => {
      draft.user = payload;
      draft.bootstrappingAuth = false;
      draft.user = null;
      draft.accessToken = null;
      draft.refreshToken = null;
      draft.expires = null;
      draft.loginLoading = false;
      draft.loginError = null;
    },
  },
  actionsWithoutReducer: ['tokenRefreshing'],
});

// Action name is constructed by the rule: `action${toUpperFirst(reducerKeyName)}`
export const {
  actionLoginLoading,
  actionLoginFailure,
  actionClearLoginError,
  actionLoginSuccess,
  actionBootstrapAuthStart,
  actionBootstrapAuthEnd,
  actionSetTokens,
  actionTokenRefreshed,
  actionUpdateUser,
  actionPatchUser,
  actionLogout,
  //
  actionTokenRefreshing,
} = actions;
export { reducer as authReducer };
