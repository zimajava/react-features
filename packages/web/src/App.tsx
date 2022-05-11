import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import { Location } from 'history';
import { store } from './store';

const Main = loadable(() => import('./pages/Main/Main'));
const Editor = loadable(() => import('./pages/Editor/Editor'));
const Login = loadable(() => import('./pages/auth/Login/Login'));
const Registration = loadable(() => import('./pages/auth/Registration/Registration'));
const ConfirmEmail = loadable(() => import('./pages/auth/ConfirmEmail/ConfirmEmail'));

function NotFound() {
  return <h2>NotFound</h2>;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <main
          className={css`
            margin: 0 auto;
            max-width: 1080px;
          `}
        >
          <header className="App-header">
            <nav>
              <ul
                className={css`
                  display: flex;
                  padding: 10px;
                  font-size: 18px;
                  list-style: none;

                  & > li {
                    padding: 5px;
                  }
                `}
              >
                <li>
                  <Link to={(location: Location) => `/${location.search}`}>Main</Link>
                </li>
              </ul>
            </nav>
          </header>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/editor/:noteId" component={Editor} />
            <Route exact path="/signin" component={Login} />
            <Route exact path="/signup" component={Registration} />
            <Route exact path="/confirm/:token" component={ConfirmEmail} />
            <Route path="*" component={NotFound} />
          </Switch>
        </main>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
