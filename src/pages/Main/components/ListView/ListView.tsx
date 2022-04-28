import React from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';
import { Note } from '../../mainSlice';
import { ListItem } from './ListItem';

const noRowsRenderer = () => (
  <div
    className={css`
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bdbdbd;
    `}
  >
    No rows
  </div>
);

export function ListView({ notes }: { notes: Array<Note> }) {
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const note = notes[index];

    return (
      <div
        className={css`
          display: flex;
          background-color: #f1f1f1;
          border: 1px solid #e0e0e0;
        `}
        key={key}
        style={style}
      >
        <ListItem note={note} />
      </div>
    );
  };

  return (
    <AutoSizer style={{ height: 'calc(100vh - 280px)', width: '100%' }}>
      {({ width, height }) => (
        <List
          autoWidth
          autoContainerWidth
          rowCount={notes.length}
          width={width}
          height={height}
          rowHeight={50}
          overscanRowCount={10}
          rowRenderer={rowRenderer}
          noRowsRenderer={noRowsRenderer}
        />
      )}
    </AutoSizer>
  );
}
