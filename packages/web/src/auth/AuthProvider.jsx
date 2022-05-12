import React from 'react';
import { Subject } from 'rxjs';

import { bindActionCreators, useConstant } from '../redux-utils';
import { makeStorage } from './storage';
import { bootAuth, makePerformLogin } from './authEffects';
import { makeCallApiRx } from './callApiRx';
// Reducer stuff
import {
  initialState,
  authReducer,
  actionLogout,
  actionSetTokens,
  actionClearLoginError,
  actionUpdateUser,
  actionPatchUser,
} from './authSlice';

// Declare Eazy Auth contexts
export const AuthStateContext = React.createContext(initialState);
export const AuthUserContext = React.createContext(null);
export const AuthActionsContext = React.createContext({});

export function AuthProvider(props) {
  const { children, render, loginCall, meCall, refreshTokenCall, storageBackend, storageNamespace = 'auth' } = props;

  const [state, originalDispatch] = React.useReducer(authReducer, initialState);
  const [actionObservable, dispatch] = useConstant(() => {
    const actionSubject = new Subject();
    const cachedDispatch = (action) => {
      originalDispatch(action);
      actionSubject.next(action);
    };

    return [actionSubject.asObservable(), cachedDispatch];
  });

  const storage = React.useMemo(
    () => makeStorage(storageBackend, storageNamespace),
    [storageBackend, storageNamespace],
  );

  const { bootstrappedAuth, accessToken, loginLoading, loginError } = state;

  // TODO: Check better strategy and future trouble \w async react
  // This trick is done because token can change over time Es:. the token was refresh
  // But the callApi function instance can't change because this can cause
  // re-running of other useEffect \w callApi as deps or break other
  // memoization ... plus this approch guarantee doesn't trigger re-render
  // of components thath subscribe only to auth actions context when token changes
  // SIDE NOTE
  // In a more idiomatic way at the ends an access token isn't important
  // for your rendering is only a detail implementation of how your
  // server rember who you are ... So if a token change isn't important for
  // rendering but is important for the (*future*) for side effects
  const tokenRef = React.useRef(null);

  // Is authenticated when has an access token eazy
  // This line can't look stupid but is very very important
  const authenticated = !!accessToken;

  // Handle the ref of booting status of eazy auth
  const bootRef = React.useRef(false);

  // Boot Eazy Auth
  // NOTE: Fuck off this subtle change the old bheaviur
  // before the boot will never appends twice but can't be stopped
  // ... now if storange change this will take again ... but storage
  // isn't supporting to changes but in theory the change of storage
  // should re-booting ma men eazy autth bho maybe check 4 future troubles
  // and come here again
  React.useEffect(() => {
    return bootAuth(meCall, refreshTokenCall, storage, dispatch, tokenRef, bootRef);
  }, [meCall, refreshTokenCall, storage, dispatch]);

  // ~~ Make Actions ~~~

  // Actions creator should't change between renders
  const bindedActionCreators = useConstant(() =>
    bindActionCreators({ actionClearLoginError, actionUpdateUser, actionPatchUser }, dispatch),
  );

  const [performLogin, unsubscribeFromLogin] = useConstant(() =>
    makePerformLogin(loginCall, meCall, storage, dispatch, tokenRef),
  );

  const login = React.useCallback(
    (loginCredentials) => {
      if (
        // Is eazy auth boostrapped?
        bootstrappedAuth &&
        // Is ma men alredy logged?
        !authenticated
      ) {
        performLogin(loginCredentials);
      }
    },
    [authenticated, bootstrappedAuth, performLogin],
  );

  const performLogout = React.useCallback(() => {
    // Clear token ref
    tokenRef.current = null;
    // Trigger log out
    dispatch(actionLogout());
    storage.removeTokens();
  }, [storage, dispatch]);

  const logout = React.useCallback(() => {
    if (authenticated) {
      performLogout();
    }
  }, [performLogout, authenticated]);

  const setTokens = React.useCallback(
    (params) => {
      const tokensBag = {
        accessToken: params.accessToken,
        refreshToken: params.refreshToken,
        expires: params.expires,
      };
      tokenRef.current = tokensBag;
      dispatch(actionSetTokens(tokensBag));
      storage.setTokens(tokensBag);
    },
    [dispatch, storage],
  );

  const { callAuthApiPromise, callAuthApiObservable, unsubscribe } = useConstant(() => {
    return makeCallApiRx(refreshTokenCall, dispatch, storage, tokenRef, bootRef, actionObservable, performLogout);
  });

  // Memoized actions
  const actions = React.useMemo(
    () => ({
      ...bindedActionCreators,
      callAuthApiPromise,
      callAuthApiObservable,
      login,
      logout,
      setTokens,
    }),
    [login, logout, bindedActionCreators, callAuthApiPromise, callAuthApiObservable, setTokens],
  );

  // Derived state for auth
  // Why this even if the token change user still authenticated
  const authState = React.useMemo(
    () => ({
      bootstrappedAuth,
      authenticated,
      loginLoading,
      loginError,
    }),
    [authenticated, bootstrappedAuth, loginLoading, loginError],
  );

  const userState = React.useMemo(() => ({ user: state.user, token: accessToken }), [state.user, accessToken]);

  React.useEffect(() => {
    return () => {
      // Goodbye Space Cowboy
      unsubscribe();
      unsubscribeFromLogin();
    };
  }, [unsubscribe, unsubscribeFromLogin]);

  return (
    <AuthActionsContext.Provider value={actions}>
      <AuthStateContext.Provider value={authState}>
        <AuthUserContext.Provider value={userState}>
          {typeof render === 'function' ? render(actions, authState, userState) : children}
        </AuthUserContext.Provider>
      </AuthStateContext.Provider>
    </AuthActionsContext.Provider>
  );
}
