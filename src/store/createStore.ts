import { configureStore, Reducer } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
// We'll use redux-logger just as an example of adding another middleware
import logger from 'redux-logger';

// And use redux-batch as an example of adding enhancers
import { reduxBatch } from '@manaflair/redux-batch';

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();

export function createStore(reducer: Record<string, Reducer>) {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: true }).concat(sagaMiddleware, logger),
    devTools: true /* process.env.NODE_ENV !== 'production' */,
    enhancers: [reduxBatch],
  });
}
