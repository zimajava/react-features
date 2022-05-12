import React, { isValidElement, createElement } from 'react';
import { Route } from 'react-router';
import { useAuthState } from '../hooks';

/**
 * Wait for auth loading before rendering route component
 * (needed for first time local storage auth...)
 *
 */
export function MaybeAuthRoute(props) {
  const { children, component, render, spinner = null, ...rest } = props;

  const { bootstrappedAuth, loginLoading } = useAuthState();

  return (
    <Route
      {...rest}
      render={(routerProps) => {
        if (!bootstrappedAuth || loginLoading) {
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
