import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';

import { config } from '../config';
import { Container } from '../pages/shared-components';
import { ProtectedPages } from '../pages/ProtectedPages';
import { AuthRoute } from './components';

const Login = loadable(() => import('../pages/auth/Login/Login'));
const Registration = loadable(() => import('../pages/auth/Registration/Registration'));
const ConfirmEmail = loadable(() => import('../pages/auth/ConfirmEmail/ConfirmEmail'));

function NotFound() {
  return <Container>NotFound</Container>;
}

export function RootRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <AuthRoute exact path="/signin" component={Login} />
        <AuthRoute exact path="/signup" component={Registration} />
        <AuthRoute exact path="/confirm/:token" component={ConfirmEmail} />
        <Route exact path={config.routing.map((route) => route.path)} component={ProtectedPages} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}