/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

export type Todo = { id: string; text: string; completed: boolean };
export type TodosState = {
  isLoading: boolean;
  todos: Array<Todo>;
  visibilityFilter: string;
};

export const initialState: TodosState = {
  isLoading: false,
  todos: [],
  visibilityFilter: 'SHOW_COMPLETED',
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, { payload }) {
      state.todos = payload;
    },
    createTodo(state, { payload }) {
      state.todos.push({ id: v4(), text: payload, completed: false });
    },
    toggleTodo(state, { payload }) {
      state.todos[payload].completed = !state.todos[payload].completed;
    },
    removeTodo(state, { payload }) {
      state.todos = state.todos.filter((_, idx) => idx !== payload);
    },
  },
});

const { toggleTodo, createTodo, removeTodo, setTodos } = todosSlice.actions;

export { toggleTodo, createTodo, removeTodo, setTodos };
