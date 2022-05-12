import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import createTheme from '@mui/material/styles/createTheme';
import MuiThemeProvider from '@mui/styles/ThemeProvider';
import useTheme from '@mui/styles/useTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode, Theme } from '@mui/material';

import { GlobalStyles } from './GlobalStyles';

type State = { paletteType: PaletteMode };
type Action = { type: 'changeTheme'; payload: PaletteMode };
type Reducer = (prevState: State, action: Action) => State;

type Props = { defaultTheme: PaletteMode; children: React.ReactChild };

const ThemeDispatchContext = React.createContext<React.Dispatch<Action> | null>(null);

export function ThemeProvider(props: Props): JSX.Element {
  const { defaultTheme, children } = props;

  const themeInitialOptions = { paletteType: defaultTheme };

  const [themeOptions, dispatch] = React.useReducer<Reducer, State>(
    (state: State, action: Action): State => {
      if (action.type === 'changeTheme') {
        return { ...state, paletteType: action.payload };
      }

      return state;
    },
    themeInitialOptions,
    (state) => state,
  );

  const memoizedTheme = React.useMemo(() => {
    const theme = createTheme({ palette: { mode: themeOptions.paletteType } });

    return responsiveFontSizes(theme);
  }, [themeOptions.paletteType]);

  return (
    <MuiThemeProvider theme={memoizedTheme}>
      <EmotionThemeProvider theme={memoizedTheme}>
        <ThemeDispatchContext.Provider value={dispatch}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </ThemeDispatchContext.Provider>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  );
}

export const useChangeTheme = (): (() => void) => {
  const dispatch = React.useContext(ThemeDispatchContext);
  const theme = useTheme<Theme>();

  return React.useCallback(() => {
    if (dispatch) {
      dispatch({ type: 'changeTheme', payload: theme.palette.mode === 'light' ? 'dark' : 'light' });
    }
  }, [dispatch, theme.palette.mode]);
};
