/* eslint-disable no-param-reassign */
import React from 'react';
import Immutable from 'immutable';
import {
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  Masonry,
  Size,
  Positioner,
  MasonryCellProps,
} from 'react-virtualized';
// eslint-disable-next-line @emotion/no-vanilla
import { css } from '@emotion/css';

import createCellPositioner from './createCellPositioner';
import { generateRandomList } from './utils';

const cache = new CellMeasurerCache({ defaultHeight: 250, defaultWidth: 200, fixedWidth: true });

const list = Immutable.List(generateRandomList());

const state = {
  columnWidth: 200,
  height: 300,
  gutterSize: 10,
  overscanByPixels: 0,
};

function BaseAbout() {
  const masonry = React.useRef<Masonry | null>();
  const columnCount = React.useRef(0);
  const scrollTop = React.useRef(false);
  const size = React.useRef<Size>({ width: 0, height: 0 });
  const cellPositioner = React.useRef<Positioner | null>();

  const initCellPositioner = () => {
    if (!cellPositioner.current) {
      cellPositioner.current = createCellPositioner({
        cellMeasurerCache: cache,
        columnCount: columnCount.current,
        columnWidth: state.columnWidth,
        spacer: state.gutterSize,
      });
    }
  };

  const calculateColumnCount = () => {
    columnCount.current = Math.floor(size.current.width / (state.columnWidth + state.gutterSize));
  };

  React.useEffect(() => {
    size.current.height = state.height;
    initCellPositioner();
    calculateColumnCount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCellPositioner = () => {
    if (cellPositioner.current) {
      cellPositioner.current.reset({
        columnCount: columnCount.current,
        columnWidth: state.columnWidth,
        spacer: state.gutterSize,
      });
    }
  };

  const recomputeRowsSizes = ({ width }: Size) => {
    size.current.width = width;

    calculateColumnCount();
    resetCellPositioner();

    if (masonry.current) {
      masonry.current.recomputeCellPositions();
    }
  };

  const cellRenderer = ({ index, key, parent, style }: MasonryCellProps) => {
    const { columnWidth } = state;

    const datum = list.get(index % list.size);

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            border-radius: 0.5rem;
            padding: 0.5rem;
            background-color: #f7f7f7;
            word-break: break-all;
          `}
          style={{ ...style, width: columnWidth }}
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
    <AutoSizer
      // disableHeight
      // height={state.height}
      style={{ height: state.height, width: '100%' }}
      onResize={recomputeRowsSizes}
      overscanByPixels={state.overscanByPixels}
      // scrollTop={scrollTop.current}
    >
      {({ width, height }) => {
        size.current.width = width;
        size.current.height = height;

        initCellPositioner();
        calculateColumnCount();

        return (
          <Masonry
            ref={(ref) => {
              masonry.current = ref;
            }}
            autoHeight={false}
            cellCount={1000}
            cellMeasurerCache={cache}
            // @ts-ignore
            cellPositioner={cellPositioner.current}
            cellRenderer={cellRenderer}
            height={state.height}
            overscanByPixels={state.overscanByPixels}
            // scrollTop={scrollTop.current}
            width={width}
          />
        );
      }}
    </AutoSizer>
  );
}

export default React.memo(BaseAbout);
