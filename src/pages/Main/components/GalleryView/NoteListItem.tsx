import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

type Props = {
  maxWidth: number;
  data: any | undefined;
};

function CardLink(props: DefaultComponentProps<any>) {
  const { noteid } = props;

  return <Link {...props} to={`/editor/${noteid}`} component={RouterLink} sx={{ textDecoration: 'none' }} />;
}

export function NoteListItem({ maxWidth, data }: Props) {
  const date = data?.createdAt ? new Date(data.createdAt * 1000).toDateString() : '';
  /* , backgroundColor: data?.color */
  return (
    <Card noteid={data.id} component={CardLink} sx={{ maxWidth }} elevation={3}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data?.title}
        subheader={date}
      />
      {/* <CardMedia component="img" height="194" image="/static/images/cards/paella.jpg" alt="Paella dish" /> */}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {data?.preview}
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
