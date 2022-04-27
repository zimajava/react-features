/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

export type Note = {
  id: string;
  title: string;
  userId: string;
  content: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
};

export type MainState = {
  isLoading: boolean;
  notes: Array<Note>;
};

export const initialState: MainState = {
  isLoading: false,
  notes: [],
};

export const mainSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, { payload }) {
      state.notes = payload;
    },
  },
});

const { setNotes } = mainSlice.actions;

export { setNotes };
