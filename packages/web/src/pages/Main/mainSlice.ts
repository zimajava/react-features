/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// import { v4 } from 'uuid';

export type Note = {
  id: string;
  title: string;
  userId: string;
  content: string;
  preview: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};

export type User = {
  id: number;
  email: string;
  name: string;
  avatarId: any;
  isEmailConfirmed: boolean;
  isRegisteredWithGoogle: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
};

export type MainState = {
  isLoading: boolean;
  notes: Array<Note>;
  // TODO move
  isAuthenticated: boolean;
  user: User | null;
};

export const initialState: MainState = {
  isLoading: false,
  notes: [],
  isAuthenticated: false,
  user: null,
};

export const mainSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, { payload }) {
      state.notes = payload;
    },
    setAuthenticated(state, { payload }) {
      state.isAuthenticated = payload;
    },
    setUser(state, { payload }) {
      state.user = payload;
    },
  },
});

const { setNotes, setAuthenticated, setUser } = mainSlice.actions;

export { setNotes, setAuthenticated, setUser };
