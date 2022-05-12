import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { config } from '../../../config';
import { useChangeTheme } from '../../../theme/ThemeProvider';
import { IOSSwitch } from '../Switch/IOSSwitch';
import { AppBar } from './AppBar';
import { Drawer } from './Drawer';
import { DrawerHeader } from './DrawerHeader';
import { Location } from 'history';

type Props = {
  title: string;
  logoSrc: string;
  handleLogOut: () => void;
};

const LS_KEY = 'open_drawer';

export function AppDrawer(props: Props): JSX.Element {
  const { title, logoSrc, handleLogOut } = props;

  const location = useLocation();
  const handleChangeTheme = useChangeTheme();
  const theme = useTheme();
  const [open, setOpen] = React.useState(() => {
    const lsState = localStorage.getItem(LS_KEY);
    return Boolean(lsState !== null ? JSON.parse(lsState) : false);
  });

  const handleDrawerOpen = React.useCallback(() => {
    localStorage.setItem(LS_KEY, String(true));
    setOpen(true);
  }, []);
  const handleDrawerClose = React.useCallback(() => {
    localStorage.setItem(LS_KEY, String(false));
    setOpen(false);
  }, []);

  const InnerAvatar = React.useCallback(() => {
    return logoSrc ? <Avatar alt={title} src={logoSrc} /> : <Avatar>{title ? title[0] : ''}</Avatar>;
  }, [logoSrc, title]);

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <InnerAvatar />
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: '15px' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', marginRight: '15px' }}>
            <IOSSwitch onChange={handleChangeTheme} />
            <Typography variant="subtitle1">Switch theme</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleLogOut}>
              LogOut
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {config.routing.filter(({ includeInMenu }) => !!includeInMenu).map(({ name, path, Icon }) => (
            <Link
              key={name}
              to={(location: Location) => `${path}${location.search}`}
              component={NavLink}
              variant="body1"
              color={location.pathname === path ? 'primary' : 'inherit'}
              sx={{ textDecoration: 'none' }}
            >
              <ListItem button selected={location.pathname === path}>
                <ListItemIcon>
                  <Icon color={location.pathname === path ? 'primary' : undefined} />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </>
  );
}
