// @ts-nocheck
import React from 'react';
import { Route, Redirect } from 'react-router';

import { useAuthState } from '../hooks/useAuthState';

const RedirectAuthRoute = React.memo((props) => {
  const {
    children,
    component,
    render,
    redirectTo = '/signin',
    rememberReferrer = true,
    userRedirectTo,
    isAuthenticated,
    ...rest
  } = props;

  return (
    <Route
      {...rest}
      render={(routerProps) => {
        // User authenticated
        if (isAuthenticated) {
          // Redirect a logged user?
          if (userRedirectTo) {
            return <Redirect to={userRedirectTo} />;
          }
          // Render as a Route
          return (
            children ||
            (component
              ? React.createElement(component, { ...routerProps, ...rest })
              : render({ ...routerProps, ...rest }))
          );
        }
        // User not authenticated, redirect to login
        const to =
          typeof redirectTo === 'string'
            ? {
                pathname: redirectTo,
              }
            : redirectTo;
        return (
          <Redirect
            to={{
              ...to,
              state: {
                ...to.state,
                referrer:
                  // TODO: Handle logoutFromPermission when implemented 403 handling
                  // in eazy auth ....
                  rememberReferrer // && !auth.logoutFromPermission
                    ? routerProps.location
                    : undefined,
              },
            }}
          />
        );
      }}
    />
  );
});

/**
 * Ensure user logged otherwise redirect them to login
 *
 */
export function ProtectedRoute({ redirectTest, ...rest }) {
  const { isAuthenticated, user } = useAuthState();

  const userRedirectToMemo = React.useMemo(() => {
    if (user && typeof redirectTest === 'function') {
      const userRedirectTo = redirectTest(user);

      if (userRedirectTo) {
        return userRedirectTo;
      }
    }

    return null;
  }, [user, redirectTest]);

  // NOTE: split in two components is only an optimization
  // to avoid re-execute Route render when user changes but
  // the output of redirect test doesnt't change
  return <RedirectAuthRoute userRedirectTo={userRedirectToMemo} isAuthenticated={isAuthenticated} {...rest} />;
}
