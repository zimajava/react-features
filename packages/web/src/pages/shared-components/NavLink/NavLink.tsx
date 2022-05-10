import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import MaterialLink from '@mui/material/Link';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

export const NavLink = React.forwardRef<HTMLElement, DefaultComponentProps<any>>(({ sx, ...props }, ref) => (
  <MaterialLink
    ref={ref}
    exact
    component={RouterNavLink}
    sx={{ textDecoration: 'none', ...sx }}
    {...props}
    rel="noreferrer"
  />
));