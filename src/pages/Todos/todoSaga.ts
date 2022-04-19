import { call, takeLatest, put } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';

import { actionGetTodos } from './actions';
import type { Todo } from './todosSlice';
import { setTodos } from './todosSlice';

function* getTodos() {
  const url = 'https://624d5b17c172b69d69319d2c.mockapi.io/api/v1/todo';

  const { data }: AxiosResponse<Array<Todo>> = yield call(axios.get, url);

  yield put(setTodos(data));
}

export function* todosSaga() {
  yield takeLatest(actionGetTodos.type, getTodos);
}
