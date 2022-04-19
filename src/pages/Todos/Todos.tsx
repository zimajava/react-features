import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import type { RootState } from '../../store';
import type { Todo } from './todosSlice';
import { actionGetTodos } from './actions';
import { toggleTodo, createTodo, removeTodo } from './todosSlice';

export default function Todos() {
  const todos = useSelector<RootState, Array<Todo>>((state) => state.todosState.todos);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    dispatch(actionGetTodos());
  }, [dispatch]);

  return (
    <>
      <h2
        className={css`
          text-align: center;
        `}
      >
        Todos
      </h2>
      <div
        className={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div>...Loading</div>
        <ul
          className={css`
            list-style: none;
          `}
        >
          <input
            value={value}
            type="text"
            onChange={(event) => {
              event.preventDefault();
              setValue(event.currentTarget.value);
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && value) {
                dispatch(createTodo(value));
                setValue('');
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (value) {
                dispatch(createTodo(value));
                setValue('');
              }
            }}
          >
            Create
          </button>
          {todos.map(({ id, text, completed }, idx) => (
            <li key={id}>
              <label>
                <input type="checkbox" defaultChecked={completed} onClick={() => dispatch(toggleTodo(idx))} />
                <span style={{ textDecoration: completed ? 'line-through' : 'initial' }}>{text}</span>
                <input type="button" value="x" onClick={() => dispatch(removeTodo(idx))} />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
