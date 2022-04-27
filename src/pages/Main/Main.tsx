/* eslint-disable no-param-reassign */
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { Note } from './mainSlice';
import { actionGetNotes } from './actions';
import { ListToggle } from './components/ListToggle';
import { ViewTypeEnum } from './ViewType.enum';
import { GalleryView } from './components/GalleryView/GalleryView';
import { ListView } from './components/ListView/ListView';

function BaseMain() {
  const dispatch = useDispatch();
  const [type, setType] = React.useState<ViewTypeEnum>(ViewTypeEnum.gallery);
  const notes = useSelector<RootState, Array<Note>>((s) => s.main.notes, shallowEqual);

  React.useEffect(() => {
    dispatch(actionGetNotes());
  }, [dispatch]);

  const Component = type === ViewTypeEnum.gallery ? GalleryView : ListView;

  return (
    <div>
      <ListToggle type={type} changeType={setType} />
      {notes.length ? <Component notes={notes} /> : <div>...Loading</div>}
    </div>
  );
}

export default React.memo(BaseMain);
