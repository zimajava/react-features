import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { Location } from 'history';

export function CustomLink(props: DefaultComponentProps<any>) {
  const { noteid } = props;

  return (
    <Link
      {...props}
      to={(location: Location) => `/editor/${noteid}${location.search}`}
      component={RouterLink}
      sx={{ textDecoration: 'none' }}
    />
  );
}
