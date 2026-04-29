import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3F51B5',
    },
    secondary: {
      main: '#009688',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#F9A825',
    },
    success: {
      main: '#388E3C',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
