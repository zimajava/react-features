import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import { store } from './store';

const About = loadable(() => import('./pages/About'));
const Articles = loadable(() => import('./pages/Note/Note'));
const Todos = loadable(() => import('./pages/Todos/Todos'));

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <main className="App">
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
                  <Link to="/">Todos</Link>
                </li>
                <li>
                  <Link to="/articles">Articles</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
              </ul>
            </nav>
          </header>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/articles" component={Articles} />
            <Route path="/" component={Todos} />
          </Switch>
        </main>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
