import React, { isValidElement, createElement } from 'react';
import { Route, Redirect } from 'react-router';
import { useAuthState } from '../hooks';

/**
 * Redirect to home when user logged in
 *
 */
export function GuestRoute(props) {
  const { children, component, render, spinner = null, redirectTo = '/', redirectToReferrer = false, ...rest } = props;

  const { authenticated, bootstrappedAuth } = useAuthState();

  return (
    <Route
      {...rest}
      render={(routerProps) => {
        if (authenticated) {
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

        if (!bootstrappedAuth) {
          // Spinner as element as component or null
          // eslint-disable-next-line no-nested-ternary
          return spinner ? (isValidElement(spinner) ? spinner : createElement(spinner)) : null;
        }
        // Render as a Route
        return children || (component ? createElement(component, routerProps) : render(routerProps));
      }}
    />
  );
}
