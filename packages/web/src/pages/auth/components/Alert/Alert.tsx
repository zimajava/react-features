import React from 'react';
import MaterialAlert from '@mui/material/Alert';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';

export function Alert({ children, color, ...props }: DefaultComponentProps<any>) {
  return (
    <MaterialAlert variant="outlined" {...props} severity={color}>
      {children}
    </MaterialAlert>
  );
}