import React from 'react';
import Box from '@mui/material/Box';
import MaterialContainer from '@mui/material/Container';
import { DefaultComponentProps, OverridableTypeMap } from '@mui/material/OverridableComponent';
import { Breakpoint } from '@mui/material';

interface CustomProps extends OverridableTypeMap {
  props: {
    boxSX?: React.CSSProperties;
    maxWidth?: false | Breakpoint;
  };
}

export function Container({ boxSX, maxWidth = 'sm', component, children }: DefaultComponentProps<CustomProps>) {
  return (
    <MaterialContainer component="main" maxWidth={maxWidth}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '35px',
          ...boxSX,
        }}
        component={component}
        elevation={3}
      >
        {children}
      </Box>
    </MaterialContainer>
  );
}
