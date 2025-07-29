// theme.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4b6cb7' },
    background: { default: '#ffffff', paper: '#f9f9f9' },
    text: { primary: '#1f1f1f' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4b6cb7' },
    background: { default: '#121212', paper: '#1f1f1f' },
    text: { primary: '#ffffff' },
  },
});
