import React from 'react';
import Box from '@mui/material/Box';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

export function Form({ children, ...props }: DefaultComponentProps<any>) {
  return (
    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off" {...props}>
      {children}
    </Box>
  );
}
