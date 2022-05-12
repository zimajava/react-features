/* eslint-disable no-param-reassign */
import { from, of, throwError, Subject } from 'rxjs';
import { mergeMap, map, catchError, exhaustMap, tap } from 'rxjs/operators';

import {
  actionBootstrapAuthStart,
  actionBootstrapAuthEnd,
  actionLoginLoading,
  actionLoginSuccess,
  actionLoginFailure,
} from './authSlice';

function makeCallWithRefresh(refreshTokenCall, accessToken, refreshToken) {
  return (apiFn, ...args) => {
    return from(apiFn(...args, accessToken)).pipe(
      map((response) => [response, null]),
      catchError((error) => {
        if (
          // Tri refresh when:
          // Got an auth error
          error.status === 401 &&
          // We have a refresh token and an api call that we can perform
          // 2 refresh it!
          refreshToken &&
          typeof refreshTokenCall === 'function'
        ) {
          return from(refreshTokenCall(refreshToken)).pipe(
            mergeMap((refreshedTokens) => {
              // Yeah refresh appends!
              // Ok now retry the apiFn \w refreshed shit!
              return from(apiFn(...args, refreshedTokens.accessToken)).pipe(
                map((response) => {
                  // console.log('Refresh appends!', refreshedTokens)
                  // Curry the refreshed shit \w response
                  return [response, refreshedTokens];
                }),
                // The error of new api fn don't really means
                // instead reject the original 401 to enforce logout process
                catchError(() => throwError(error)),
              );
            }),
            // At this point the refresh error does not is so usefuel
            // instead reject the original 401 to enforce logout process
            catchError(() => throwError(error)),
          );
        }
        // Normal rejection
        return throwError(error);
      }),
    );
  };
}

// Boot eazy-auth
// Read tokens from provided storage
// if any try to use theese to authenticate the user \w the given meCall
// LS -> meCall(token) -> user
// dispatch to top state and keep token in sync using a React useRef
export function bootAuth(meCall, refreshTokenCall, storage, dispatch, tokenRef, bootRef) {
  // Shortcut to finish boot process default not authenticated
  function endBoot(payload = { authenticated: false }) {
    bootRef.current = true;
    dispatch(actionBootstrapAuthEnd(payload));
  }

  // console.log('Booootstrap Ma MEN Eazy Auth')
  dispatch(actionBootstrapAuthStart());

  const subscription = from(storage.getTokens())
    .pipe(
      mergeMap((tokensInStorage) => {
        // No tokens in storage Nothing 2 do
        if (!tokensInStorage) {
          return of([tokensInStorage, null]);
        }

        // Prepare the ~ M A G I K ~ Api call with refresh
        const callWithRefresh = makeCallWithRefresh(
          refreshTokenCall,
          tokensInStorage.accessToken,
          tokensInStorage.refreshToken,
        );

        return callWithRefresh(meCall).pipe(
          catchError((err) => {
            // Clear bad tokens from storage
            storage.removeTokens();
            return throwError(err);
          }),
          map((responseWithRefresh) => [tokensInStorage, responseWithRefresh]),
        );
      }),
    )
    .subscribe(([tokensInStorage, responseWithRefresh]) => {
      // Nothing to do
      if (!responseWithRefresh) {
        endBoot();
      }
      const [user, refreshedTokens] = responseWithRefresh;
      // If token refreshed take the token refreshed as valid otherwise use the good
      // old tokens from local storage
      const validTokens = refreshedTokens || tokensInStorage;

      // GANG saved the valid tokens to the current ref!
      tokenRef.current = validTokens;

      // Tell to ma reducer
      endBoot({ authenticated: true, user, ...validTokens });
      // Plus only if refreshed save freshed in local storage!
      if (refreshedTokens) {
        storage.setTokens(refreshedTokens);
      }
    }, endBoot);

  return () => subscription.unsubscribe();
}

export function makePerformLogin(loginCall, meCall, storage, dispatch, tokenRef) {
  const loginTrigger = new Subject();

  const subscription = loginTrigger
    .asObservable()
    .pipe(
      tap(() => dispatch(actionLoginLoading())),
      exhaustMap((loginCredentials) => {
        return from(loginCall(loginCredentials)).pipe(
          mergeMap((loginResponse) => {
            // eslint-disable-next-line camelcase
            const { access_token } = loginResponse;
            return from(meCall(access_token, loginResponse)).pipe(
              map((user) => actionLoginSuccess([loginResponse, user])),
            );
          }),
          catchError((error) => of(actionLoginFailure(error))),
        );
      }),
    )
    .subscribe((action) => {
      if (actionLoginSuccess.MATCH(action)) {
        // Login Flow Success
        const [loginResponse, user] = action.payload;
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expires = null } = loginResponse;
        // Save the token ref GANG!
        tokenRef.current = { accessToken, refreshToken, expires };
        dispatch(actionLoginSuccess({ user, expires, accessToken, refreshToken }));
        // Ok this can be an async action sure but
        // is better wait them and so do waiting the use before
        // notify them that login was success i don't kown....
        storage.setTokens({ expires, accessToken, refreshToken });
      } else if (actionLoginFailure.MATCH(action)) {
        // Login Flow Failure
        dispatch(action);
      }
    });

  const performLogin = (loginCredentials) => loginTrigger.next(loginCredentials);

  return [performLogin, () => subscription.unsubscribe()];
}
