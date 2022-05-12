import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export const config = {
  routing: [
    { includeInMenu: true, path: '/', name: 'Main', Icon: HomeRoundedIcon },
    { path: '/editor/:noteId', name: 'Editor' },
  ],
};
