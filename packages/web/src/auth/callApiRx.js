import { Subject, concat, of, defer, from, empty, throwError } from 'rxjs';
import { filter, exhaustMap, takeUntil, publish, map, catchError, take, mergeMap } from 'rxjs/operators';

import { actionLogout, actionTokenRefreshed, actionTokenRefreshing, actionBootstrapAuthEnd } from './authSlice';

// Emulate a 401 Unauthorized from server ....
const UNAUTHORIZED_ERROR_SHAPE = { status: 401, fromRefresh: true };

// const tokenRefreshed = (payload) => ({ type: TOKEN_REFRESHED, payload });
//
// const tokenRefreshing = () => ({ type: TOKEN_REFRESHING });

// Wecolme 2 ~ H E L L ~
// callApi implemented using rxjs too keep only 1 refreshing task at time
export function makeCallApiRx(refreshTokenCall, dispatch, storage, tokenRef, bootRef, actionObservable, logout) {
  let refreshingSemaphore = false;

  // An Observable that emit when logout was dispatched
  const logoutObservable = actionObservable.pipe(filter((action) => actionLogout.MATCH(action)));

  // Subject for emit refresh tasks
  const refreshEmitter = new Subject();

  // An Observable that perform the refresh token call
  // until logout was dispatched and emit actions
  const refreshRoutine = refreshEmitter.asObservable().pipe(
    exhaustMap((refreshToken) => {
      return concat(
        of(actionTokenRefreshing()),
        from(refreshTokenCall(refreshToken)).pipe(
          map((refreshResponse) =>
            actionTokenRefreshed({
              accessToken: refreshResponse.accessToken,
              refreshToken: refreshResponse.refreshToken,
              expires: refreshResponse.expires,
            }),
          ),
          catchError((error) => of(actionLogout(error))),
          takeUntil(logoutObservable),
        ),
      );
    }),
    publish(),
  );

  // Make an Observable that complete with access token
  // when TOKEN_REFRESHED action is dispatched
  // or throw a simil 401 error when logout is dispatched
  // this can be used as 'virtual' refreshToken() api
  function waitForStoreRefreshObservable() {
    return actionObservable.pipe(
      filter((action) => actionTokenRefreshed.MATCH(action) || actionLogout.MATCH(action)),
      take(1),
      mergeMap((action) => {
        if (actionLogout.MATCH(action)) {
          return throwError(UNAUTHORIZED_ERROR_SHAPE);
        }

        return of(action.payload.accessToken);
      }),
    );
  }

  // Make an Observable that complete with token or throw a 401 like error
  // Handle theee situations:
  // - Wait eazy auth to booted before try to getting an access token
  // - Wait a peening refresh task (if any) before getting an access token
  function getAccessToken() {
    const authBooted = bootRef.current;

    // Wait eazy-auth boot ...
    let waitBootObservable;

    if (!authBooted) {
      waitBootObservable = actionObservable.pipe(
        filter((action) => actionBootstrapAuthEnd.MATCH(action)),
        take(1),
        mergeMap(() => empty()),
      );
    } else {
      waitBootObservable = empty();
    }

    return concat(
      waitBootObservable,
      defer(() => {
        // Get the actual token
        const { accessToken = null } = tokenRef.current || {};

        // Not authenticated, complete empty
        if (accessToken === null) {
          return of(null);
        }

        const refreshing = refreshingSemaphore;
        // Refresh in place wait from redux
        if (refreshing) {
          return waitForStoreRefreshObservable();
        }

        // Valid acces token in store!
        return of(accessToken);
      }),
    );
  }

  // Make an observable that refresh token
  // only with no pending refresh is in place
  // complete \w refresh token or throw a 401 like error
  function refreshOnUnauth(accessToken2Refresh) {
    const { accessToken = null, refreshToken = null } = tokenRef.current || {};

    if (accessToken === null) {
      // An error occurred but in the meanwhile
      // logout or bad refresh was happends...
      return throwError(UNAUTHORIZED_ERROR_SHAPE);
    }

    const refreshing = refreshingSemaphore;
    if (refreshing) {
      return waitForStoreRefreshObservable();
    }

    if (accessToken !== accessToken2Refresh) {
      // Another cool guy has refresh ma token
      // return new tokens ...
      return of(accessToken);
    }

    // Ok this point token match the current
    // no refresh ar in place so ....
    // start refresh!
    refreshEmitter.next(refreshToken);
    return waitForStoreRefreshObservable();
  }

  // Logout user when an unauthorized error happens or refresh failed
  function unauthLogout(badAccessToken, error) {
    const { accessToken = null } = tokenRef.current || {};
    const refreshing = refreshingSemaphore;

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (accessToken !== null && !refreshing && accessToken === badAccessToken) {
      if (typeof error === 'object' && error.status === 401) {
        logout();
      } /* else if (typeof error === 'object' && error.status === 403) {
        logout({ fromPermission: true })
      } */
    }
  }

  function onObsevableError(error, apiFn, firstAccessToken, args) {
    if (firstAccessToken !== null) {
      if (typeof refreshTokenCall !== 'function') {
        // Refresh can't be called
        // notify logout when needed give back error
        unauthLogout(firstAccessToken, error);
        return throwError(error);
      }
      if (error.status === 401) {
        // Try refresh
        return refreshOnUnauth(firstAccessToken).pipe(
          mergeMap((accessToken) => {
            return from(apiFn(accessToken)(...args)).pipe(
              catchError((e) => {
                unauthLogout(accessToken, e);
                return throwError(e);
              }),
            );
          }),
        );
      }
    }
    return throwError(error);
  }

  function callAuthApiObservable(apiFn, ...args) {
    return getAccessToken().pipe(
      mergeMap((firstAccessToken) =>
        from(apiFn(firstAccessToken)(...args)).pipe(
          catchError((error) => onObsevableError(error, apiFn, firstAccessToken, args)),
        ),
      ),
    );
  }

  function callAuthApiPromise(apiFn, ...args) {
    return getAccessToken()
      .toPromise()
      .then((firstAccessToken) => {
        return apiFn(firstAccessToken)(...args).catch((error) => {
          if (firstAccessToken !== null) {
            if (typeof refreshTokenCall !== 'function') {
              // Refresh can't be called
              unauthLogout(firstAccessToken, error);
              return Promise.reject(error);
            }
            if (error.status === 401) {
              // Try refresh
              return refreshOnUnauth(firstAccessToken)
                .toPromise()
                .then((accessToken) => {
                  return apiFn(accessToken)(...args).catch((e) => {
                    unauthLogout(accessToken, e);
                    return Promise.reject(e);
                  });
                });
            }
          }
          // Unauthorized
          return Promise.reject(error);
        });
      });
  }

  // GioVa 1312 illegal boy
  const firstBootSub = actionObservable
    .pipe(
      filter((action) => actionBootstrapAuthEnd.MATCH(action)),
      take(1),
    )
    .subscribe(() => {
      refreshRoutine.connect();
    });

  const logoutSub = actionObservable.pipe(filter((action) => actionLogout.MATCH(action))).subscribe(() => {
    refreshingSemaphore = false;
  });

  const refreshSub = refreshRoutine.subscribe((action) => {
    if (actionTokenRefreshing.MATCH(action)) {
      refreshingSemaphore = true;
    } else if (actionTokenRefreshed.MATCH(action)) {
      const { payload } = action;

      refreshingSemaphore = false;
      tokenRef.current = payload;
      dispatch(action);
      storage.setTokens(payload);
    } else if (actionLogout.MATCH(action)) {
      refreshingSemaphore = false;
      logout();
    }
  });

  function unsubscribe() {
    firstBootSub.unsubscribe();
    logoutSub.unsubscribe();
    refreshSub.unsubscribe();
  }

  return { callAuthApiObservable, callAuthApiPromise, unsubscribe };
}
