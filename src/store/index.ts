import { Saga } from 'redux-saga';

import { todosSlice } from '../pages/Todos/todosSlice';
import { todosSaga } from '../pages/Todos/todoSaga';
import { createStore, sagaMiddleware } from './createStore';

export const store = createStore({ todosState: todosSlice.reducer });

sagaMiddleware.run(<Saga>todosSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
