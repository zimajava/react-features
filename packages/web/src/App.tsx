import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from './theme/ThemeProvider';
import { store } from './store';
import { RootRouter } from './router/RootRouter';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <RootRouter />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
