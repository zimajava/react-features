/* eslint-disable no-param-reassign */
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { Note } from './mainSlice';
import { actionGetNotes } from './actions';
import { ListToggle } from './components/ListToggle';
import { ViewTypeEnum } from './ViewType.enum';
import { GalleryView } from './components/GalleryView/GalleryView';
import { ListView } from './components/ListView/ListView';

function BaseMain() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [type, setType] = React.useState<ViewTypeEnum>(() => {
    const params = new URLSearchParams(location.search);
    let urlType = params.get('type') as ViewTypeEnum;
    const isValidType = !!ViewTypeEnum[urlType];

    if (!isValidType) {
      urlType = ViewTypeEnum.gallery;
      params.set('type', urlType);
      history.replace(`${location.pathname}?${params.toString()}`);
    }

    return urlType;
  });
  const notes = useSelector<RootState, Array<Note>>((s) => s.main.notes, shallowEqual);

  React.useEffect(() => {
    dispatch(actionGetNotes());
  }, [dispatch]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);

    params.set('type', type);
    history.replace(`${location.pathname}?${params.toString()}`);
  }, [history, location.pathname, location.search, type]);

  const Component = type === ViewTypeEnum.gallery ? GalleryView : ListView;

  return (
    <div>
      <ListToggle type={type} changeType={setType} />
      {notes.length ? <Component notes={notes} /> : <div>...Loading</div>}
    </div>
  );
}

export default React.memo(BaseMain);
