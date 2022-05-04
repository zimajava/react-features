import React from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  MasonryCellProps,
  Positioner,
  Size,
} from 'react-virtualized';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import { GalleryItem } from './GalleryItem';
import { Note } from '../../mainSlice';

const cellMeasurerCache = new CellMeasurerCache({ defaultHeight: 250, defaultWidth: 200, fixedWidth: true });

const state = {
  columnWidth: 340,
  height: 300,
  gutterSize: 10,
  overscanByPixels: 0,
};

export function GalleryView({ notes }: { notes: Array<Note> }) {
  const masonry = React.useRef<Masonry | null>();
  const columnCount = React.useRef(0);
  const size = React.useRef<Size>({ width: 0, height: state.height });
  const cellPositioner = React.useRef<Positioner | null>();

  const initCellPositioner = () => {
    if (!cellPositioner.current) {
      cellPositioner.current = createMasonryCellPositioner({
        cellMeasurerCache,
        columnCount: columnCount.current,
        columnWidth: state.columnWidth,
        spacer: state.gutterSize,
      });
    }
  };

  const calculateColumnCount = () => {
    columnCount.current = Math.floor(size.current.width / (state.columnWidth + state.gutterSize));
  };

  const resetCellPositioner = () => {
    if (cellPositioner.current) {
      cellPositioner.current.reset({
        columnCount: columnCount.current,
        columnWidth: state.columnWidth,
        spacer: state.gutterSize,
      });
    }
  };

  React.useLayoutEffect(() => {
    initCellPositioner();
    calculateColumnCount();

    return () => {
      cellMeasurerCache.clearAll();
      resetCellPositioner();

      if (masonry.current) {
        masonry.current.clearCellPositions();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recomputeRowsSizes = ({ width }: Size) => {
    size.current.width = width;

    cellMeasurerCache.clearAll();

    if (masonry.current) {
      masonry.current.clearCellPositions();
    }

    calculateColumnCount();
    resetCellPositioner();

    if (masonry.current) {
      masonry.current.recomputeCellPositions();
    }
  };

  const cellRenderer = ({ index, key, parent, style }: MasonryCellProps) => {
    const note = notes[index];

    return (
      <CellMeasurer cache={cellMeasurerCache} index={index} key={key} parent={parent}>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            border-radius: 0.5rem;
            padding: 0.5rem;
            background-color: #f7f7f7;
            word-break: break-all;
          `}
          style={{ ...style, width: state.columnWidth }}
        >
          <GalleryItem maxWidth={state.columnWidth} note={note} />
        </div>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer style={{ height: 'calc(100vh - 280px)', width: '100%' }} onResize={recomputeRowsSizes}>
      {({ width, height }) => {
        size.current.width = width;
        size.current.height = height;

        return (
          <Masonry
            ref={(ref) => {
              masonry.current = ref;
            }}
            autoHeight={false}
            cellCount={notes.length}
            cellMeasurerCache={cellMeasurerCache}
            // @ts-ignore
            cellPositioner={cellPositioner.current}
            cellRenderer={cellRenderer}
            height={height}
            overscanByPixels={state.overscanByPixels}
            width={width}
          />
        );
      }}
    </AutoSizer>
  );
}
