// @ts-nocheck
import React, { createElement } from 'react';
import { Route, Redirect } from 'react-router';
import { useAuthState } from '../hooks/useAuthState';

/**
 * Redirect to home when user logged in
 *
 */
export function AuthRoute(props) {
  const { children, component, render, redirectTo = '/', redirectToReferrer = false, ...rest } = props;

  const { isAuthenticated } = useAuthState();

  return (
    <Route
      {...rest}
      render={(routerProps) => {
        if (isAuthenticated) {
          // Redirect to referrer location
          const { location } = routerProps;
          if (redirectToReferrer && location.state && location.state.referrer) {
            return (
              <Redirect
                to={
                  typeof redirectTo === 'string'
                    ? location.state.referrer
                    : // If redirectTo is an object merged the state
                      // of location to redirect....
                      {
                        ...location.state.referrer,
                        state: {
                          ...redirectTo.state,
                          ...location.state.referrer.state,
                        },
                      }
                }
              />
            );
          }

          return <Redirect to={redirectTo} />;
        }

        // Render as a Route
        return children || (component ? createElement(component, routerProps) : render(routerProps));
      }}
    />
  );
}
