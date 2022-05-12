import React from 'react';
import MaterialGlobalStyles from '@mui/material/GlobalStyles';

// import '../fonts/font.scss';

export function GlobalStyles() {
  return (
    <MaterialGlobalStyles
      styles={{
        html: { scrollBehavior: 'smooth' },
        body: {
          height: '100vh',
          // color: '#eef0f9',
          // backgroundColor: '#14171D',
          // direction: 'ltr',
          '&.fontLoaded': {
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 400,
          },
        },
      }}
    />
  );
}
