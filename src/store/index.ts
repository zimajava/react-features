import { Saga } from 'redux-saga';

import { mainSlice } from '../pages/Main/mainSlice';
import { mainSaga } from '../pages/Main/mainSaga';
import { createStore, sagaMiddleware } from './createStore';

export const store = createStore({ main: mainSlice.reducer });

sagaMiddleware.run(<Saga>mainSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
