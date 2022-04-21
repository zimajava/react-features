/* eslint-disable no-param-reassign */
import React from 'react';
import Immutable from 'immutable';
import {
  CellMeasurer,
  CellMeasurerCache,
  Masonry,
  Size,
  Positioner,
  MasonryCellProps,
  createMasonryCellPositioner,
  AutoSizer,
} from 'react-virtualized';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import { generateRandomList } from './utils';

const cellMeasurerCache = new CellMeasurerCache({ defaultHeight: 250, defaultWidth: 200, fixedWidth: true });

const state = {
  columnWidth: 200,
  height: 300,
  gutterSize: 10,
  overscanByPixels: 0,
};

function BaseAbout() {
  const [list] = React.useState(Immutable.List(generateRandomList()));
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
    const datum = list.get(index % list.size);

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
          <div
            style={{
              backgroundColor: datum?.color,
              borderRadius: '0.5rem',
              height: (datum?.size || 0) * 3,
              marginBottom: '0.5rem',
              width: '100%',
              fontSize: 20,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {index}
          </div>
          {datum?.random}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <AutoSizer style={{ height: 'calc(100vh - 165px)', width: '100%' }} onResize={recomputeRowsSizes}>
      {({ width, height }) => {
        size.current.width = width;
        size.current.height = height;

        return (
          <Masonry
            ref={(ref) => {
              masonry.current = ref;
            }}
            autoHeight={false}
            cellCount={list.count()}
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

export default React.memo(BaseAbout);
