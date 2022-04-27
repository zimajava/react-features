import { call, takeLatest, put } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';

import { actionGetNotes } from './actions';
import type { Note } from './mainSlice';
import { setNotes } from './mainSlice';

function* getNotes() {
  const url = 'https://6267ba3201dab900f1c3de35.mockapi.io/Notes';

  const { data }: AxiosResponse<Array<Note>> = yield call(axios.get, url);

  yield put(setNotes(data));
}

export function* mainSaga() {
  yield takeLatest(actionGetNotes.type, getNotes);
}
