import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Note } from '../../mainSlice';
import { CustomLink } from '../CustomLink';

type Props = {
  maxWidth: number;
  note: Note;
};

export function GalleryItem({ maxWidth, note }: Props) {
  const date = note?.createdAt ? new Date(note.createdAt * 1000).toDateString() : '';

  return (
    <Card noteid={note.id} component={CustomLink} sx={{ maxWidth }} elevation={3}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={note?.title}
        subheader={date}
      />
      {/* <CardMedia component="img" height="194" image="/static/images/cards/paella.jpg" alt="Paella dish" /> */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {note?.preview}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
